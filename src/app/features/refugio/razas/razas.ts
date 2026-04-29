import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Especie } from '../../../core/models/especies/especie.model'
import { Raza } from '../../../core/models/razas/raza.model'
import { AuthStore } from '../../../core/store/auth.store'
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component'
import { EspecieService } from '../../../shared/services/especies/especie.service'
import { NotificationService } from '../../../shared/services/notification.service'
import { RazaService } from '../../../shared/services/razas/raza.service'

@Component({
  selector: 'app-razas',
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './razas.html',
  styleUrl: './razas.scss'
})
export class RazasComponent implements OnInit {
  private razaService = inject(RazaService)
  private especieService = inject(EspecieService)
  private fb = inject(FormBuilder)
  private notificationService = inject(NotificationService)
  authStore = inject(AuthStore)

  razas = signal<Raza[]>([])
  especies = signal<Especie[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  razaEditando = signal<Raza | null>(null)
  mostrarConfirm = signal(false)
  razaAEliminar = signal<Raza | null>(null)
  eliminando = signal(false)

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
        this.notificationService.error('Error al cargar las razas')
        this.loading.set(false)
      }
    })
  }

  cargarEspecies(): void {
    this.especieService.getAll().subscribe({
      next: (data) => this.especies.set(data),
      error: () => this.notificationService.error('Error al cargar las especies')
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
          this.notificationService.success('✓ Raza actualizada correctamente')
          this.cerrarForm()
          this.cargarRazas()
        },
        error: () => this.notificationService.error('Error al actualizar la raza')
      })
    } else {
      this.razaService.create(this.form.value).subscribe({
        next: () => {
          this.notificationService.success('✓ Raza creada correctamente')
          this.cerrarForm()
          this.cargarRazas()
        },
        error: () => this.notificationService.error('Error al crear la raza')
      })
    }
  }

  abrirConfirmarEliminar(raza: Raza): void {
    this.razaAEliminar.set(raza)
    this.mostrarConfirm.set(true)
  }

  confirmarEliminar(): void {
    const raza = this.razaAEliminar()
    if (!raza) return

    this.eliminando.set(true)
    this.razaService.delete(raza.id_raza).subscribe({
      next: () => {
        this.notificationService.success('✓ Raza eliminada correctamente')
        this.cerrarConfirm()
        this.cargarRazas()
      },
      error: () => {
        this.notificationService.error('Error al eliminar la raza')
        this.eliminando.set(false)
      }
    })
  }

  cerrarConfirm(): void {
    this.mostrarConfirm.set(false)
    this.razaAEliminar.set(null)
    this.eliminando.set(false)
  }
}