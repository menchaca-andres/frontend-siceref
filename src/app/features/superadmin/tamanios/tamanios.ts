import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Tamanio } from '../../../core/models/tamanios/tamanio.model'
import { AuthStore } from '../../../core/store/auth.store'
import { TamanioService } from '../../../shared/services/tamanios/tamanio.service'

@Component({
  selector: 'app-tamanios',
  imports: [ReactiveFormsModule],
  templateUrl: './tamanios.html'
})
export class TamaniosComponent implements OnInit {
  private tamanioService = inject(TamanioService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  tamanios = signal<Tamanio[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  tamanioEditando = signal<Tamanio | null>(null)

  form: FormGroup = this.fb.group({
    nom_tam: ['', Validators.required],
    estado_tam: [true, Validators.required]
  })

  ngOnInit(): void {
    this.cargarTamanios()
  }

  cargarTamanios(): void {
    this.loading.set(true)
    this.tamanioService.getAll(true).subscribe({
      next: (data) => {
        this.tamanios.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar tamaños')
        this.loading.set(false)
      }
    })
  }

  abrirFormCrear(): void {
    this.tamanioEditando.set(null)
    this.form.reset({ estado_tam: true })
    this.mostrarForm.set(true)
  }

  abrirFormEditar(tamanio: Tamanio): void {
    this.tamanioEditando.set(tamanio)
    this.form.patchValue(tamanio)
    this.mostrarForm.set(true)
  }

  cerrarForm(): void {
    this.mostrarForm.set(false)
    this.form.reset()
  }

  onSubmit(): void {
    if (this.form.invalid) return

    const editando = this.tamanioEditando()

    if (editando) {
      this.tamanioService.update(editando.id_tam, this.form.value).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarTamanios()
        },
        error: (err) => this.error.set(err.error?.message || 'Error al actualizar tamaño')
      })
    } else {
      this.tamanioService.create(this.form.value).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarTamanios()
        },
        error: (err) => this.error.set(err.error?.message || 'Error al crear tamaño')
      })
    }
  }

  desactivar(id: number): void {
    if (!confirm('¿Estás seguro de desactivar este tamaño?')) return

    this.tamanioService.delete(id).subscribe({
      next: () => this.cargarTamanios(),
      error: (err) => this.error.set(err.error?.message || 'Error al desactivar tamaño')
    })
  }

  activar(id: number): void {
    this.tamanioService.activate(id).subscribe({
      next: () => this.cargarTamanios(),
      error: (err) => this.error.set(err.error?.message || 'Error al activar tamaño')
    })
  }
}
