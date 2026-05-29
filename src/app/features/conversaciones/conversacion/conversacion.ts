import { DatePipe } from '@angular/common'
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { Conversacion, MensajeChat } from '../../../core/models/conversaciones/conversacion.model'
import { AuthStore } from '../../../core/store/auth.store'
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge'
import { ConversacionService } from '../../../shared/services/conversaciones/conversacion.service'
import { RealtimeService } from '../../../shared/services/realtime/realtime.service'

@Component({
  selector: 'app-conversacion',
  imports: [DatePipe, ReactiveFormsModule, StatusBadgeComponent],
  templateUrl: './conversacion.html',
  styleUrl: './conversacion.scss'
})
export class ConversacionComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private conversacionService = inject(ConversacionService)
  private realtimeService = inject(RealtimeService)
  private destroyRef = inject(DestroyRef)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  conversacion = signal<Conversacion | null>(null)
  loading = signal(false)
  error = signal<string | null>(null)

  form = this.fb.group({
    contenido: ['', Validators.required]
  })

  ngOnInit(): void {
    this.realtimeService.connect()
    this.realtimeService.mensajes$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mensaje) => this.agregarMensaje(mensaje))

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
      next: (mensaje) => {
        this.form.reset()
        this.agregarMensaje(mensaje)
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

  private agregarMensaje(mensaje: MensajeChat): void {
    const conversacion = this.conversacion()
    if (!conversacion || mensaje.id_conv !== conversacion.id_conv) return
    if (conversacion.mensajes.some((item) => item.id_msj === mensaje.id_msj)) return

    this.conversacion.set({
      ...conversacion,
      mensajes: [...conversacion.mensajes, mensaje]
    })
  }
}
