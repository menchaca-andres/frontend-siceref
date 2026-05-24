import { DatePipe } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Notificacion } from '../../core/models/notificaciones/notificacion.model'
import { PublicNavbarComponent } from '../../shared/components/public-navbar/public-navbar'
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge'
import { NotificacionService } from '../../shared/services/notificaciones/notificacion.service'

@Component({
  selector: 'app-notificaciones',
  imports: [DatePipe, RouterLink, PublicNavbarComponent, StatusBadgeComponent],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.scss'
})
export class NotificacionesComponent implements OnInit {
  private notificacionService = inject(NotificacionService)

  notificaciones = signal<Notificacion[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  ngOnInit(): void {
    this.cargarNotificaciones()
  }

  cargarNotificaciones(): void {
    this.loading.set(true)
    this.notificacionService.getMine().subscribe({
      next: (data) => {
        this.notificaciones.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar notificaciones')
        this.loading.set(false)
      }
    })
  }

  marcarLeida(id: number): void {
    this.notificacionService.markAsRead(id).subscribe({
      next: () => this.cargarNotificaciones(),
      error: (err) => this.error.set(err.error?.message || 'Error al marcar notificación')
    })
  }

  notificationStatus(notificacion: Notificacion): string {
    return notificacion.leida ? 'leida' : 'pendiente'
  }
}
