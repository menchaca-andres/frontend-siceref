import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Especie } from '../../../core/models/especies/especie.model'
import { Publicacion } from '../../../core/models/publicaciones/publicacion.model'
import { Raza } from '../../../core/models/razas/raza.model'
import { Tamanio } from '../../../core/models/tamanios/tamanio.model'
import { PublicPetFiltersComponent } from '../../../shared/components/public-pet-filters/public-pet-filters'
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar'
import { EspecieService } from '../../../shared/services/especies/especie.service'
import { PublicacionService } from '../../../shared/services/publicaciones/publicacion.service'
import { RazaService } from '../../../shared/services/razas/raza.service'
import { TamanioService } from '../../../shared/services/tamanios/tamanio.service'

@Component({
  selector: 'app-mascotas-publicas',
  imports: [RouterLink, PublicNavbarComponent, PublicPetFiltersComponent],
  templateUrl: './mascotas-publicas.html',
  styleUrl: './mascotas-publicas.scss'
})
export class MascotasPublicasComponent implements OnInit {
  private publicacionService = inject(PublicacionService)
  private especieService = inject(EspecieService)
  private razaService = inject(RazaService)
  private tamanioService = inject(TamanioService)

  publicaciones = signal<Publicacion[]>([])
  especiesCatalogo = signal<Especie[]>([])
  razasCatalogo = signal<Raza[]>([])
  tamaniosCatalogo = signal<Tamanio[]>([])
  razasSeleccionadas = signal<number[]>([])
  especiesSeleccionadas = signal<number[]>([])
  tamaniosSeleccionados = signal<number[]>([])
  sexosSeleccionados = signal<string[]>([])
  busqueda = signal('')
  loading = signal(false)
  error = signal<string | null>(null)

  especies = computed(() => this.especiesCatalogo()
    .map((especie) => ({ id: especie.id_esp, nombre: especie.nom_esp }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre)))

  razas = computed(() => {
    const especiesSeleccionadas = this.especiesSeleccionadas()
    const razasPorNombre = new Map<string, { id: number, ids: number[], nombre: string }>()

    this.razasCatalogo()
      .filter((raza) => especiesSeleccionadas.length === 0 || especiesSeleccionadas.includes(raza.id_esp))
      .forEach((raza) => {
        const key = this.normalizarTexto(raza.nom_raza)
        const existente = razasPorNombre.get(key)

        if (existente) {
          existente.ids.push(raza.id_raza)
          return
        }

        razasPorNombre.set(key, { id: raza.id_raza, ids: [raza.id_raza], nombre: raza.nom_raza })
      })

    return Array.from(razasPorNombre.values())
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  })

  tamaniosFiltro = computed(() => this.tamaniosCatalogo()
    .map((tamanio) => ({ id: tamanio.id_tam, nombre: tamanio.nom_tam }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre)))

  publicacionesFiltradas = computed(() => {
    const razasSeleccionadas = this.razasSeleccionadas()
    const especiesSeleccionadas = this.especiesSeleccionadas()
    const tamaniosSeleccionados = this.tamaniosSeleccionados()
    const sexosSeleccionados = this.sexosSeleccionados()
    const busqueda = this.normalizarTexto(this.busqueda())

    return this.publicaciones().filter((publicacion) => {
      const mascota = publicacion.mascota
      if (!mascota) return false
      if (razasSeleccionadas.length > 0 && !razasSeleccionadas.includes(mascota.id_raza)) return false
      if (especiesSeleccionadas.length > 0 && !especiesSeleccionadas.includes(mascota.raza?.id_esp ?? 0)) return false
      if (tamaniosSeleccionados.length > 0 && !tamaniosSeleccionados.includes(mascota.id_tam)) return false
      if (sexosSeleccionados.length > 0 && !sexosSeleccionados.includes(mascota.sexo_mascot)) return false
      if (busqueda && !this.coincideBusqueda(publicacion, busqueda)) return false

      return true
    })
  })

  ngOnInit(): void {
    this.cargarPublicaciones()
    this.cargarCatalogos()
  }

  cargarPublicaciones(): void {
    this.loading.set(true)
    this.error.set(null)

    this.publicacionService.getAll().subscribe({
      next: (data) => {
        this.publicaciones.set(data.filter((publicacion) => publicacion.estad_publ))
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar publicaciones')
        this.loading.set(false)
      }
    })
  }

  cargarCatalogos(): void {
    this.especieService.getPublic().subscribe({
      next: (data) => this.especiesCatalogo.set(data)
    })

    this.razaService.getPublic().subscribe({
      next: (data) => this.razasCatalogo.set(data)
    })

    this.tamanioService.getPublic().subscribe({
      next: (data) => this.tamaniosCatalogo.set(data)
    })
  }

  actualizarEspecies(ids: number[]): void {
    this.especiesSeleccionadas.set(ids)
    this.razasSeleccionadas.update((razasSeleccionadas) => {
      if (ids.length === 0) return razasSeleccionadas

      const razasPermitidas = new Set(this.razasCatalogo()
        .filter((raza) => ids.includes(raza.id_esp))
        .map((raza) => raza.id_raza))

      return razasSeleccionadas.filter((id) => razasPermitidas.has(id))
    })
  }

  limpiarFiltros(): void {
    this.razasSeleccionadas.set([])
    this.especiesSeleccionadas.set([])
    this.tamaniosSeleccionados.set([])
    this.sexosSeleccionados.set([])
  }

  actualizarBusqueda(event: Event): void {
    this.busqueda.set((event.target as HTMLInputElement).value)
  }

  private coincideBusqueda(publicacion: Publicacion, busqueda: string): boolean {
    const mascota = publicacion.mascota
    const campos = [
      mascota?.nom_mascot,
      mascota?.raza?.especie?.nom_esp,
      mascota?.raza?.nom_raza,
      publicacion.refugio?.nom_ref,
      mascota?.refugio?.nom_ref
    ]

    return campos.some((campo) => this.normalizarTexto(campo).includes(busqueda))
  }

  private normalizarTexto(value: string | undefined | null): string {
    return (value ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
  }

  useImageFallback(event: Event): void {
    const image = event.target as HTMLImageElement
    image.style.display = 'none'
    image.nextElementSibling?.classList.remove('hidden')
  }

  calcularEdad(fechaNacimiento: Date | string | undefined): number | null {
    if (!fechaNacimiento) return null

    const nacimiento = new Date(fechaNacimiento)
    const hoy = new Date()
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }

    return edad
  }
}
