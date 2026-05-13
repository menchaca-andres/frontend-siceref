import { Component, inject, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Publicacion } from '../../../core/models/publicaciones/publicacion.model'
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar'
import { PublicacionService } from '../../../shared/services/publicaciones/publicacion.service'

@Component({
  selector: 'app-mascotas-publicas',
  imports: [RouterLink, PublicNavbarComponent],
  templateUrl: './mascotas-publicas.html',
  styleUrl: './mascotas-publicas.scss'
})
export class MascotasPublicasComponent implements OnInit {
  private publicacionService = inject(PublicacionService)

  publicaciones = signal<Publicacion[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  ngOnInit(): void {
    this.cargarPublicaciones()
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
