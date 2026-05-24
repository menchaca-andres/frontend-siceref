import { DatePipe } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Conversacion } from '../../../core/models/conversaciones/conversacion.model'
import { AuthStore } from '../../../core/store/auth.store'
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge'
import { ConversacionService } from '../../../shared/services/conversaciones/conversacion.service'

@Component({
  selector: 'app-conversacion',
  imports: [DatePipe, ReactiveFormsModule, StatusBadgeComponent],
  templateUrl: './conversacion.html',
  styleUrl: './conversacion.scss'
})
export class ConversacionComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private conversacionService = inject(ConversacionService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  conversacion = signal<Conversacion | null>(null)
  loading = signal(false)
  error = signal<string | null>(null)

  form = this.fb.group({
    contenido: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarConversacion()
  }

  cargarConversacion(): void {
    const idConv = Number(this.route.snapshot.paramMap.get('id_conv'))
    const idPubli = Number(this.route.snapshot.paramMap.get('id_publi'))
    if (!idConv && !idPubli) {
      this.error.set('Conversación no encontrada')
      return
    }

    this.loading.set(true)
    const request = idConv
      ? this.conversacionService.getById(idConv)
      : this.conversacionService.getByPublicacion(idPubli)

    request.subscribe({
      next: (data) => {
        this.conversacion.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar conversación')
        this.loading.set(false)
      }
    })
  }

  enviarMensaje(): void {
    const conversacion = this.conversacion()
    if (this.form.invalid || !conversacion || !this.puedeEnviarMensajes(conversacion)) return

    this.conversacionService.createMensajeByConversacion(conversacion.id_conv, { contenido: this.form.value.contenido || '' }).subscribe({
      next: () => {
        this.form.reset()
        this.cargarConversacion()
      },
      error: (err) => this.error.set(err.error?.message || 'Error al enviar mensaje')
    })
  }

  puedeEnviarMensajes(conversacion: Conversacion): boolean {
    return this.authStore.hasPermission('mensajes-chat:crear') && !!conversacion.publicacion?.estad_publ
  }

  esMensajePropio(id_remitente: number): boolean {
    return id_remitente === this.authStore.id_usu()
  }
}
