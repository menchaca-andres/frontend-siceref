import { DatePipe } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Conversacion, MensajeChat } from '../../../core/models/conversaciones/conversacion.model'
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge'
import { ConversacionService } from '../../../shared/services/conversaciones/conversacion.service'

@Component({
  selector: 'app-conversaciones',
  imports: [DatePipe, RouterLink, StatusBadgeComponent],
  templateUrl: './bandeja-conversaciones.html',
  styleUrl: './bandeja-conversaciones.scss'
})
export class ConversacionesComponent implements OnInit {
  private conversacionService = inject(ConversacionService)

  conversaciones = signal<Conversacion[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  ngOnInit(): void {
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
}
