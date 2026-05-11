import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { RefugioService } from '../../../shared/services/refugios/refugio.service'
import { Refugio } from '../../../core/models/refugios/refugio.model'
import { AuthStore } from '../../../core/store/auth.store'

@Component({
  selector: 'app-refugios',
  imports: [ReactiveFormsModule],
  templateUrl: './refugios.html'
})
export class RefugiosComponent implements OnInit {
  private refugioService = inject(RefugioService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  refugios = signal<Refugio[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  refugioEditando = signal<Refugio | null>(null)

  form: FormGroup = this.fb.group({
    nom_ref: ['', Validators.required],
    direc_ref: ['', Validators.required],
    telef_ref: ['', Validators.required],
    email_ref: ['', [Validators.required, Validators.email]],
    estado_ref: [true, Validators.required]
  })

  ngOnInit(): void {
    this.cargarRefugios()
  }

  cargarRefugios(): void {
    this.loading.set(true)
    this.refugioService.getAll().subscribe({
      next: (data) => {
        this.refugios.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error.message || 'Error al cargar refugios')
        this.loading.set(false)
      }
    })
  }

  abrirFormCrear(): void {
    this.refugioEditando.set(null)
    this.form.reset({ estado_ref: true })
    this.mostrarForm.set(true)
  }

  abrirFormEditar(refugio: Refugio): void {
    this.refugioEditando.set(refugio)
    this.form.patchValue(refugio)
    this.mostrarForm.set(true)
  }

  cerrarForm(): void {
    this.mostrarForm.set(false)
    this.form.reset()
  }

  onSubmit(): void {
    if (this.form.invalid) return

    const editando = this.refugioEditando()

    if (editando) {
      this.refugioService.update(editando.id_ref, this.form.value).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarRefugios()
        },
        error: (err) => this.error.set(err.error.message)
      })
    } else {
      this.refugioService.create(this.form.value).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarRefugios()
        },
        error: (err) => this.error.set(err.error.message)
      })
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este refugio?')) return

    this.refugioService.delete(id).subscribe({
      next: () => this.cargarRefugios(),
      error: (err) => this.error.set(err.error.message)
    })
  }
}
