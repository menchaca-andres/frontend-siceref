import { DatePipe } from '@angular/common'
import { Component, OnInit, inject, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { AuthStore } from '../../../core/store/auth.store'
import { Notificacion } from '../../../core/models/notificaciones/notificacion.model'
import { NotificacionService } from '../../services/notificaciones/notificacion.service'

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

  notificacionesNoLeidas = signal(0)
  notificaciones = signal<Notificacion[]>([])
  mostrarNotificaciones = signal(false)

  ngOnInit(): void {
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
    this.authStore.logout()
    this.router.navigate(['/auth/login'])
  }
}
