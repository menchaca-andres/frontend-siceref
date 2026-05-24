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
  razaSeleccionada = signal('')
  especieSeleccionada = signal('')
  tamanioSeleccionado = signal('')
  sexoSeleccionado = signal('')
  loading = signal(false)
  error = signal<string | null>(null)

  especies = computed(() => this.especiesCatalogo()
    .map((especie) => ({ id: especie.id_esp, nombre: especie.nom_esp }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre)))

  razas = computed(() => {
    const especieSeleccionada = Number(this.especieSeleccionada())

    return this.razasCatalogo()
      .filter((raza) => !especieSeleccionada || raza.id_esp === especieSeleccionada)
      .map((raza) => ({ id: raza.id_raza, nombre: raza.nom_raza, id_esp: raza.id_esp }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  })

  tamaniosFiltro = computed(() => this.tamaniosCatalogo()
    .map((tamanio) => ({ id: tamanio.id_tam, nombre: tamanio.nom_tam }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre)))

  publicacionesFiltradas = computed(() => {
    const razaSeleccionada = Number(this.razaSeleccionada())
    const especieSeleccionada = Number(this.especieSeleccionada())
    const tamanioSeleccionado = Number(this.tamanioSeleccionado())
    const sexoSeleccionado = this.sexoSeleccionado()

    return this.publicaciones().filter((publicacion) => {
      const mascota = publicacion.mascota
      if (!mascota) return false
      if (razaSeleccionada && mascota.id_raza !== razaSeleccionada) return false
      if (especieSeleccionada && mascota.raza?.id_esp !== especieSeleccionada) return false
      if (tamanioSeleccionado && mascota.id_tam !== tamanioSeleccionado) return false
      if (sexoSeleccionado && mascota.sexo_mascot !== sexoSeleccionado) return false

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

  actualizarEspecie(id: string): void {
    this.especieSeleccionada.set(id)
    this.razaSeleccionada.set('')
  }

  limpiarFiltros(): void {
    this.razaSeleccionada.set('')
    this.especieSeleccionada.set('')
    this.tamanioSeleccionado.set('')
    this.sexoSeleccionado.set('')
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
