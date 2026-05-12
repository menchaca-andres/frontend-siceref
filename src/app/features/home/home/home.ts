import { DatePipe } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { Publicacion } from '../../../core/models/publicaciones/publicacion.model'
import { AuthStore } from '../../../core/store/auth.store'
import { PublicacionService } from '../../../shared/services/publicaciones/publicacion.service'

@Component({
  selector: 'app-home',
  imports: [DatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private publicacionService = inject(PublicacionService)
  private router = inject(Router)
  authStore = inject(AuthStore)

  publicaciones = signal<Publicacion[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  ngOnInit(): void {
    this.cargarPublicaciones()
  }

  cargarPublicaciones(): void {
    this.loading.set(true)
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

  logout(): void {
    this.authStore.logout()
    this.router.navigate(['/home'])
  }

  panelRoute(): string {
    if (this.authStore.hasPermission('refugios:obtener')) return '/superadmin/refugios'
    if (this.authStore.hasPermission('mascotas:obtener')) return '/refugio/mascotas'
    if (this.authStore.hasPermission('perfil:obtener')) return '/adoptante/perfil'
    return '/home'
  }

  useImageFallback(event: Event): void {
    const image = event.target as HTMLImageElement
    image.style.display = 'none'
    image.nextElementSibling?.classList.remove('hidden')
  }
}
