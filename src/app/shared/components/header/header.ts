import { DatePipe } from '@angular/common'
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { Router, RouterLink } from '@angular/router'
import { AuthStore } from '../../../core/store/auth.store'
import { Notificacion } from '../../../core/models/notificaciones/notificacion.model'
import { NotificacionService } from '../../services/notificaciones/notificacion.service'
import { RealtimeService } from '../../services/realtime/realtime.service'

@Component({
  selector: 'app-header',
  imports: [DatePipe, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  authStore = inject(AuthStore)
  private router = inject(Router)
  private notificacionService = inject(NotificacionService)
  private realtimeService = inject(RealtimeService)
  private destroyRef = inject(DestroyRef)

  notificacionesNoLeidas = signal(0)
  notificaciones = signal<Notificacion[]>([])
  mostrarNotificaciones = signal(false)

  ngOnInit(): void {
    this.realtimeService.connect()
    this.realtimeService.notificaciones$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((notificacion) => this.agregarNotificacion(notificacion))

    this.cargarNotificaciones()
  }

  cargarNotificaciones(): void {
    if (!this.authStore.hasPermission('notificaciones:obtener')) return

    this.notificacionService.getMine().subscribe({
      next: (notificaciones) => {
        this.notificaciones.set(notificaciones.slice(0, 5))
        this.notificacionesNoLeidas.set(notificaciones.filter((notificacion) => !notificacion.leida).length)
      },
      error: () => {
        this.notificaciones.set([])
        this.notificacionesNoLeidas.set(0)
      }
    })
  }

  toggleNotificaciones(): void {
    this.mostrarNotificaciones.update((value) => !value)
  }

  marcarLeida(notificacion: Notificacion): void {
    this.notificacionService.markAsRead(notificacion.id_noti).subscribe({
      next: () => this.cargarNotificaciones()
    })
  }

  logout(): void {
    this.realtimeService.disconnect()
    this.authStore.logout()
    this.router.navigate(['/auth/login'])
  }

  private agregarNotificacion(notificacion: Notificacion): void {
    if (this.notificaciones().some((item) => item.id_noti === notificacion.id_noti)) return

    this.notificaciones.update((notificaciones) => [notificacion, ...notificaciones].slice(0, 5))
    if (!notificacion.leida) this.notificacionesNoLeidas.update((total) => total + 1)
  }
}
