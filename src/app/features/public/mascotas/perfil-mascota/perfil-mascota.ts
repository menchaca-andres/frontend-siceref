import { DatePipe } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { Publicacion } from '../../../../core/models/publicaciones/publicacion.model'
import { PublicNavbarComponent } from '../../../../shared/components/public-navbar/public-navbar'
import { PublicacionService } from '../../../../shared/services/publicaciones/publicacion.service'

@Component({
  selector: 'app-perfil-mascota',
  imports: [DatePipe, RouterLink, PublicNavbarComponent],
  templateUrl: './perfil-mascota.html',
  styleUrl: './perfil-mascota.scss'
})
export class PerfilMascotaComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private publicacionService = inject(PublicacionService)

  publicacion = signal<Publicacion | null>(null)
  loading = signal(false)
  error = signal<string | null>(null)

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))
    if (!id) {
      this.error.set('Publicación no encontrada')
      return
    }

    this.cargarPublicacion(id)
  }

  cargarPublicacion(id: number): void {
    this.loading.set(true)
    this.error.set(null)

    this.publicacionService.getById(id).subscribe({
      next: (data) => {
        if (!data.estad_publ) {
          this.error.set('Esta publicación ya no está disponible')
          this.publicacion.set(null)
        } else {
          this.publicacion.set(data)
        }

        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar la mascota')
        this.loading.set(false)
      }
    })
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

  useImageFallback(event: Event): void {
    const image = event.target as HTMLImageElement
    image.style.display = 'none'
    image.nextElementSibling?.classList.remove('hidden')
  }
}
