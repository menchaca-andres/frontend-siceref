import { Component, OnDestroy, computed, inject, signal } from '@angular/core'
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'
import { PagoQr } from '../../../core/models/pagos/pago-qr.model'
import { PagoQrService } from '../../../shared/services/pagos/pago-qr.service'

@Component({
  selector: 'app-donar',
  imports: [ReactiveFormsModule],
  templateUrl: './donar.html',
  styleUrl: './donar.scss'
})
export class DonarComponent implements OnDestroy {
  private fb = inject(FormBuilder)
  private pagoQrService = inject(PagoQrService)
  private pollingId: ReturnType<typeof setInterval> | null = null
  private countdownId: ReturnType<typeof setInterval> | null = null

  loading = signal(false)
  error = signal<string | null>(null)
  pago = signal<PagoQr | null>(null)
  now = signal(Date.now())

  form = this.fb.group({
    amount: [20, [Validators.required, Validators.min(1)]],
    gloss: ['Donacion general', [Validators.required, Validators.maxLength(80)]]
  })

  qrImageSrc = computed(() => {
    const image = this.pago()?.qr_image_base64
    return image ? `data:image/png;base64,${image}` : null
  })

  remainingSeconds = computed(() => {
    const pago = this.pago()
    if (!pago || ['PAGADO', 'CANCELADO', 'FALLIDO', 'ERROR'].includes(pago.estado)) return null

    const expiration = new Date(pago.fecha_expira).getTime()
    return Math.max(0, Math.ceil((expiration - this.now()) / 1000))
  })

  countdownLabel = computed(() => {
    const seconds = this.remainingSeconds()
    if (seconds === null) return ''

    const minutes = Math.floor(seconds / 60)
    const rest = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
  })

  ngOnDestroy(): void {
    this.stopPolling()
    this.stopCountdown()
  }

  generarQr(): void {
    if (this.form.invalid || this.loading()) return

    this.loading.set(true)
    this.error.set(null)
    this.pago.set(null)
    this.stopPolling()
    this.stopCountdown()

    const amount = Number(this.form.value.amount)
    const gloss = String(this.form.value.gloss || '').trim()

    this.pagoQrService.create({ amount, gloss, expiresIn: 900 }).subscribe({
      next: (pago) => {
        this.pago.set(pago)
        this.loading.set(false)
        this.startPolling(pago.id_pago)
        this.startCountdown()
      },
      error: (err) => {
        this.error.set(err.error?.message || 'No se pudo generar el QR')
        this.loading.set(false)
      }
    })
  }

  private startPolling(id: number): void {
    this.pollingId = setInterval(() => {
      this.pagoQrService.getStatus(id).subscribe({
        next: (pago) => {
          this.pago.set(pago)
          if (['PAGADO', 'EXPIRADO', 'CANCELADO', 'FALLIDO', 'ERROR'].includes(pago.estado)) {
            this.stopPolling()
            this.stopCountdown()
          }
        }
      })
    }, 2500)
  }

  private stopPolling(): void {
    if (!this.pollingId) return
    clearInterval(this.pollingId)
    this.pollingId = null
  }

  private startCountdown(): void {
    this.now.set(Date.now())
    this.countdownId = setInterval(() => {
      this.now.set(Date.now())
    }, 1000)
  }

  private stopCountdown(): void {
    if (!this.countdownId) return
    clearInterval(this.countdownId)
    this.countdownId = null
  }
}
