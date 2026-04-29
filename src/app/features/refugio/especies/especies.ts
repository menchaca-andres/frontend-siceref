import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { EspecieService } from '../../../shared/services/especies/especie.service'
import { Especie } from '../../../core/models/especies/especie.model'
import { AuthStore } from '../../../core/store/auth.store'

@Component({
  selector: 'app-especies',
  imports: [ReactiveFormsModule],
  templateUrl: './especies.html'
})
export class EspeciesComponent implements OnInit {
  private especieService = inject(EspecieService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  especies = signal<Especie[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  especieEditando = signal<Especie | null>(null)

  form: FormGroup = this.fb.group({
    nom_espe: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarEspecies()
  }

  cargarEspecies(): void {
    this.loading.set(true)
    this.especieService.getAll().subscribe({
      next: (data) => {
        this.especies.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error.message)
        this.loading.set(false)
      }
    })
  }

  abrirFormCrear(): void {
    this.especieEditando.set(null)
    this.form.reset()
    this.mostrarForm.set(true)
  }

  abrirFormEditar(especie: Especie): void {
    this.especieEditando.set(especie)
    this.form.patchValue(especie)
    this.mostrarForm.set(true)
  }

  cerrarForm(): void {
    this.mostrarForm.set(false)
    this.form.reset()
  }

  onSubmit(): void {
    if (this.form.invalid) return

    const editando = this.especieEditando()

    if (editando) {
      this.especieService.update(editando.id_espe, this.form.value).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarEspecies()
        },
        error: (err) => this.error.set(err.error.message)
      })
    } else {
      this.especieService.create(this.form.value).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarEspecies()
        },
        error: (err) => this.error.set(err.error.message)
      })
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta especie?')) return

    this.especieService.delete(id).subscribe({
      next: () => this.cargarEspecies(),
      error: (err) => this.error.set(err.error.message)
    })
  }
}