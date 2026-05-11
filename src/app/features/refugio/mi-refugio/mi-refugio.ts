import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Refugio } from '../../../core/models/refugios/refugio.model'
import { AuthStore } from '../../../core/store/auth.store'
import { RefugioService } from '../../../shared/services/refugios/refugio.service'

@Component({
  selector: 'app-mi-refugio',
  imports: [ReactiveFormsModule],
  templateUrl: './mi-refugio.html'
})
export class MiRefugioComponent implements OnInit {
  private refugioService = inject(RefugioService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  refugio = signal<Refugio | null>(null)
  loading = signal(false)
  error = signal<string | null>(null)
  success = signal<string | null>(null)
  editando = signal(false)

  form: FormGroup = this.fb.group({
    nom_ref: ['', Validators.required],
    direc_ref: ['', Validators.required],
    telef_ref: ['', Validators.required],
    email_ref: ['', [Validators.required, Validators.email]],
    estado_ref: [true, Validators.required]
  })

  ngOnInit(): void {
    this.cargarRefugio()
  }

  cargarRefugio(): void {
    const idRef = this.authStore.id_ref()
    if (!idRef) {
      this.error.set('No hay un refugio asociado a tu usuario')
      return
    }

    this.loading.set(true)
    this.refugioService.getById(idRef).subscribe({
      next: (data) => {
        this.refugio.set(data)
        this.form.patchValue(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar refugio')
        this.loading.set(false)
      }
    })
  }

  activarEdicion(): void {
    this.error.set(null)
    this.success.set(null)
    this.editando.set(true)
  }

  cancelarEdicion(): void {
    this.editando.set(false)
    const refugio = this.refugio()
    if (refugio) this.form.patchValue(refugio)
  }

  onSubmit(): void {
    const idRef = this.authStore.id_ref()
    if (this.form.invalid || !idRef) return

    this.refugioService.update(idRef, this.form.value).subscribe({
      next: (data) => {
        this.refugio.set(data)
        this.editando.set(false)
        this.success.set('Refugio actualizado correctamente')
      },
      error: (err) => this.error.set(err.error?.message || 'Error al actualizar refugio')
    })
  }
}
