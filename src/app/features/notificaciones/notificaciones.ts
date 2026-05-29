import { DatePipe } from '@angular/common'
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { RouterLink } from '@angular/router'
import { Conversacion } from '../../core/models/conversaciones/conversacion.model'
import { Notificacion } from '../../core/models/notificaciones/notificacion.model'
import { AuthStore } from '../../core/store/auth.store'
import { PublicNavbarComponent } from '../../shared/components/public-navbar/public-navbar'
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge'
import { ConversacionService } from '../../shared/services/conversaciones/conversacion.service'
import { NotificacionService } from '../../shared/services/notificaciones/notificacion.service'
import { RealtimeService } from '../../shared/services/realtime/realtime.service'

@Component({
  selector: 'app-notificaciones',
  imports: [DatePipe, RouterLink, PublicNavbarComponent, StatusBadgeComponent],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.scss'
})
export class NotificacionesComponent implements OnInit {
  private notificacionService = inject(NotificacionService)
  private conversacionService = inject(ConversacionService)
  private realtimeService = inject(RealtimeService)
  private destroyRef = inject(DestroyRef)
  authStore = inject(AuthStore)

  notificaciones = signal<Notificacion[]>([])
  conversaciones = signal<Conversacion[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  ngOnInit(): void {
    this.realtimeService.connect()
    this.realtimeService.notificaciones$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notificacion) => this.agregarNotificacion(notificacion))

    this.cargarNotificaciones()
    this.cargarConversaciones()
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

  conversationLink(notificacion: Notificacion): unknown[] {
    if (!notificacion.id_publi) return ['/conversaciones']

    if (this.authStore.id_ref() !== null) {
      const conversacion = this.conversaciones().find((item) => item.id_publi === notificacion.id_publi)
      return conversacion ? ['/conversaciones', conversacion.id_conv] : ['/conversaciones']
    }

    return ['/conversaciones/publicacion', notificacion.id_publi]
  }

  private cargarConversaciones(): void {
    if (!this.authStore.hasPermission('conversaciones:obtener')) return

    this.conversacionService.getMine().subscribe({
      next: (data) => this.conversaciones.set(data),
      error: () => this.conversaciones.set([])
    })
  }

  private agregarNotificacion(notificacion: Notificacion): void {
    if (this.notificaciones().some((item) => item.id_noti === notificacion.id_noti)) return
    this.notificaciones.update((notificaciones) => [notificacion, ...notificaciones])
  }
}
