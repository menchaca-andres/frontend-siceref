import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { RazaService } from '../../../shared/services/razas/raza.service'
import { EspecieService } from '../../../shared/services/especies/especie.service'
import { Raza } from '../../../core/models/razas/raza.model'
import { Especie } from '../../../core/models/especies/especie.model'
import { AuthStore } from '../../../core/store/auth.store'

@Component({
  selector: 'app-razas',
  imports: [ReactiveFormsModule],
  templateUrl: './razas.html'
})
export class RazasComponent implements OnInit {
  private razaService = inject(RazaService)
  private especieService = inject(EspecieService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  razas = signal<Raza[]>([])
  especies = signal<Especie[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  razaEditando = signal<Raza | null>(null)

  form: FormGroup = this.fb.group({
    id_espe: ['', Validators.required],
    nom_raza: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarRazas()
    this.cargarEspecies()
  }

  cargarRazas(): void {
    this.loading.set(true)
    this.razaService.getAll().subscribe({
      next: (data) => {
        this.razas.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error.message)
        this.loading.set(false)
      }
    })
  }

  cargarEspecies(): void {
    this.especieService.getAll().subscribe({
      next: (data) => this.especies.set(data)
    })
  }

  abrirFormCrear(): void {
    this.razaEditando.set(null)
    this.form.reset()
    this.mostrarForm.set(true)
  }

  abrirFormEditar(raza: Raza): void {
    this.razaEditando.set(raza)
    this.form.patchValue(raza)
    this.mostrarForm.set(true)
  }

  cerrarForm(): void {
    this.mostrarForm.set(false)
    this.form.reset()
  }

  onSubmit(): void {
    if (this.form.invalid) return

    const editando = this.razaEditando()

    if (editando) {
      this.razaService.update(editando.id_raza, this.form.value).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarRazas()
        },
        error: (err) => this.error.set(err.error.message)
      })
    } else {
      this.razaService.create(this.form.value).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarRazas()
        },
        error: (err) => this.error.set(err.error.message)
      })
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta raza?')) return

    this.razaService.delete(id).subscribe({
      next: () => this.cargarRazas(),
      error: (err) => this.error.set(err.error.message)
    })
  }
}