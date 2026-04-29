import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Especie } from '../../../core/models/especies/especie.model'
import { AuthStore } from '../../../core/store/auth.store'
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component'
import { EspecieService } from '../../../shared/services/especies/especie.service'
import { NotificationService } from '../../../shared/services/notification.service'

@Component({
  selector: 'app-especies',
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './especies.html',
  styleUrl: './especies.scss'
})
export class EspeciesComponent implements OnInit {
  private especieService = inject(EspecieService)
  private fb = inject(FormBuilder)
  private notificationService = inject(NotificationService)
  authStore = inject(AuthStore)

  especies = signal<Especie[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  especieEditando = signal<Especie | null>(null)
  mostrarConfirm = signal(false)
  especieAEliminar = signal<Especie | null>(null)
  eliminando = signal(false)

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
        this.notificationService.error('Error al cargar las especies')
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
          this.notificationService.success('✓ Especie actualizada correctamente')
          this.cerrarForm()
          this.cargarEspecies()
        },
        error: () => this.notificationService.error('Error al actualizar la especie')
      })
    } else {
      this.especieService.create(this.form.value).subscribe({
        next: () => {
          this.notificationService.success('✓ Especie creada correctamente')
          this.cerrarForm()
          this.cargarEspecies()
        },
        error: () => this.notificationService.error('Error al crear la especie')
      })
    }
  }

  abrirConfirmarEliminar(especie: Especie): void {
    this.especieAEliminar.set(especie)
    this.mostrarConfirm.set(true)
  }

  confirmarEliminar(): void {
    const especie = this.especieAEliminar()
    if (!especie) return

    this.eliminando.set(true)
    this.especieService.delete(especie.id_espe).subscribe({
      next: () => {
        this.notificationService.success('✓ Especie eliminada correctamente')
        this.cerrarConfirm()
        this.cargarEspecies()
      },
      error: () => {
        this.notificationService.error('Error al eliminar la especie')
        this.eliminando.set(false)
      }
    })
  }

  cerrarConfirm(): void {
    this.mostrarConfirm.set(false)
    this.especieAEliminar.set(null)
    this.eliminando.set(false)
  }
}