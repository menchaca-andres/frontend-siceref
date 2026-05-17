import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Publicacion } from '../../../core/models/publicaciones/publicacion.model'
import { Tamanio } from '../../../core/models/tamanios/tamanio.model'
import { PublicPetFiltersComponent } from '../../../shared/components/public-pet-filters/public-pet-filters'
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar'
import { PublicacionService } from '../../../shared/services/publicaciones/publicacion.service'
import { TamanioService } from '../../../shared/services/tamanios/tamanio.service'

@Component({
  selector: 'app-mascotas-publicas',
  imports: [RouterLink, PublicNavbarComponent, PublicPetFiltersComponent],
  templateUrl: './mascotas-publicas.html',
  styleUrl: './mascotas-publicas.scss'
})
export class MascotasPublicasComponent implements OnInit {
  private publicacionService = inject(PublicacionService)
  private tamanioService = inject(TamanioService)

  publicaciones = signal<Publicacion[]>([])
  tamanios = signal<Tamanio[]>([])
  razaSeleccionada = signal('')
  especieSeleccionada = signal('')
  tamanioSeleccionado = signal('')
  sexoSeleccionado = signal('')
  loading = signal(false)
  error = signal<string | null>(null)

  especies = computed(() => {
    const especies = new Map<number, string>()

    for (const publicacion of this.publicaciones()) {
      const especie = publicacion.mascota?.raza?.especie
      if (especie) especies.set(especie.id_esp, especie.nom_esp)
    }

    return Array.from(especies, ([id, nombre]) => ({ id, nombre })).sort((a, b) => a.nombre.localeCompare(b.nombre))
  })

  razas = computed(() => {
    const razas = new Map<number, { id: number; nombre: string; id_esp?: number }>()
    const especieSeleccionada = Number(this.especieSeleccionada())

    for (const publicacion of this.publicaciones()) {
      const raza = publicacion.mascota?.raza
      if (!raza) continue
      if (especieSeleccionada && raza.id_esp !== especieSeleccionada) continue
      razas.set(raza.id_raza, { id: raza.id_raza, nombre: raza.nom_raza, id_esp: raza.id_esp })
    }

    return Array.from(razas.values()).sort((a, b) => a.nombre.localeCompare(b.nombre))
  })

  tamaniosFiltro = computed(() => this.tamanios().map((tamanio) => ({ id: tamanio.id_tam, nombre: tamanio.nom_tam })))

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
    this.cargarTamanios()
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

  cargarTamanios(): void {
    this.tamanioService.getAll().subscribe({
      next: (data) => this.tamanios.set(data)
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
