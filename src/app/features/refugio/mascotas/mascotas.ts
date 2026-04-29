import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { MascotaService } from '../../../shared/services/mascotas/mascota.service'
import { RazaService } from '../../../shared/services/razas/raza.service'
import { Mascota } from '../../../core/models/mascotas/mascota.model'
import { Raza } from '../../../core/models/razas/raza.model'
import { AuthStore } from '../../../core/store/auth.store'

@Component({
  selector: 'app-mascotas',
  imports: [ReactiveFormsModule],
  templateUrl: './mascotas.html'
})
export class MascotasComponent implements OnInit {
  private mascotaService = inject(MascotaService)
  private razaService = inject(RazaService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  mascotas = signal<Mascota[]>([])
  razas = signal<Raza[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  mascotaEditando = signal<Mascota | null>(null)

  form: FormGroup = this.fb.group({
    id_raza: ['', Validators.required],
    nom_mascot: ['', Validators.required],
    edad_mascot: ['', [Validators.required, Validators.min(0)]],
    fenac_mascot: ['', Validators.required],
    descrip_mascot: ['', Validators.required],
    gen_mascot: [true, Validators.required],
    esterilizado: [false, Validators.required],
    img_mascot: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarMascotas()
    this.cargarRazas()
  }

  cargarMascotas(): void {
    this.loading.set(true)
    this.mascotaService.getAll().subscribe({
      next: (data) => {
        this.mascotas.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error.message)
        this.loading.set(false)
      }
    })
  }

  cargarRazas(): void {
    this.razaService.getAll().subscribe({
      next: (data) => this.razas.set(data)
    })
  }

  abrirFormCrear(): void {
    this.mascotaEditando.set(null)
    this.form.reset({ gen_mascot: true, esterilizado: false })
    this.mostrarForm.set(true)
  }

  abrirFormEditar(mascota: Mascota): void {
    this.mascotaEditando.set(mascota)
    this.form.patchValue(mascota)
    this.mostrarForm.set(true)
  }

  cerrarForm(): void {
    this.mostrarForm.set(false)
    this.form.reset()
  }

  onSubmit(): void {
    if (this.form.invalid) return

    const editando = this.mascotaEditando()

    if (editando) {
      this.mascotaService.update(editando.id_mascot, this.form.value).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarMascotas()
        },
        error: (err) => this.error.set(err.error.message)
      })
    } else {
      this.mascotaService.create(this.form.value).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarMascotas()
        },
        error: (err) => this.error.set(err.error.message)
      })
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return

    this.mascotaService.delete(id).subscribe({
      next: () => this.cargarMascotas(),
      error: (err) => this.error.set(err.error.message)
    })
  }
}