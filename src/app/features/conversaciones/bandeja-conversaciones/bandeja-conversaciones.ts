import { DatePipe } from '@angular/common'
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { RouterLink } from '@angular/router'
import { Conversacion, MensajeChat } from '../../../core/models/conversaciones/conversacion.model'
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge'
import { ConversacionService } from '../../../shared/services/conversaciones/conversacion.service'
import { RealtimeService } from '../../../shared/services/realtime/realtime.service'

@Component({
  selector: 'app-conversaciones',
  imports: [DatePipe, RouterLink, StatusBadgeComponent],
  templateUrl: './bandeja-conversaciones.html',
  styleUrl: './bandeja-conversaciones.scss'
})
export class ConversacionesComponent implements OnInit {
  private conversacionService = inject(ConversacionService)
  private realtimeService = inject(RealtimeService)
  private destroyRef = inject(DestroyRef)

  conversaciones = signal<Conversacion[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  ngOnInit(): void {
    this.realtimeService.connect()
    this.realtimeService.mensajes$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mensaje) => this.actualizarUltimoMensaje(mensaje))

    this.cargarConversaciones()
  }

  cargarConversaciones(): void {
    this.loading.set(true)
    this.conversacionService.getMine().subscribe({
      next: (data) => {
        this.conversaciones.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar conversaciones')
        this.loading.set(false)
      }
    })
  }

  ultimoMensaje(conversacion: Conversacion): MensajeChat | null {
    return conversacion.mensajes.at(-1) || null
  }

  private actualizarUltimoMensaje(mensaje: MensajeChat): void {
    const conversacion = this.conversaciones().find((item) => item.id_conv === mensaje.id_conv)
    if (!conversacion) {
      this.cargarConversaciones()
      return
    }

    if (conversacion.mensajes.some((item) => item.id_msj === mensaje.id_msj)) return

    this.conversaciones.update((conversaciones) => [
      { ...conversacion, mensajes: [...conversacion.mensajes, mensaje] },
      ...conversaciones.filter((item) => item.id_conv !== mensaje.id_conv)
    ])
  }
}
