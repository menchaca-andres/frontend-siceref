import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Refugio } from '../../../core/models/refugios/refugio.model'
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component'
import { NotificationService } from '../../../shared/services/notification.service'
import { RefugioService } from '../../../shared/services/refugios/refugio.service'

@Component({
  selector: 'app-refugios',
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './refugios.html',
  styleUrl: './refugios.scss'
})
export class RefugiosComponent implements OnInit {
  private refugioService = inject(RefugioService)
  private fb = inject(FormBuilder)
  private notificationService = inject(NotificationService)

  refugios = signal<Refugio[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  refugioEditando = signal<Refugio | null>(null)
  mostrarConfirm = signal(false)
  refugioAEliminar = signal<Refugio | null>(null)
  eliminando = signal(false)

  form: FormGroup = this.fb.group({
    nom_refug: ['', Validators.required],
    dir_refug: ['', Validators.required],
    telf_refug: ['', Validators.required],
    corr_refug: ['', [Validators.required, Validators.email]],
    contra_refug: ['', Validators.required],
    licencia_refug: ['', Validators.required]
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
        this.notificationService.error('Error al cargar los refugios')
        this.loading.set(false)
      }
    })
  }

  abrirFormCrear(): void {
    this.refugioEditando.set(null)
    this.form.reset()
    this.form.get('contra_refug')?.setValidators(Validators.required)
    this.form.get('contra_refug')?.updateValueAndValidity()
    this.mostrarForm.set(true)
  }

  abrirFormEditar(refugio: Refugio): void {
    this.refugioEditando.set(refugio)
    this.form.patchValue(refugio)
    this.form.get('contra_refug')?.clearValidators()
    this.form.get('contra_refug')?.updateValueAndValidity()
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
      this.refugioService.update(editando.id_refug, this.form.value).subscribe({
        next: () => {
          this.notificationService.success('✓ Refugio actualizado correctamente')
          this.cerrarForm()
          this.cargarRefugios()
        },
        error: () => this.notificationService.error('Error al actualizar el refugio')
      })
    } else {
      this.refugioService.create(this.form.value).subscribe({
        next: () => {
          this.notificationService.success('✓ Refugio creado correctamente')
          this.cerrarForm()
          this.cargarRefugios()
        },
        error: () => this.notificationService.error('Error al crear el refugio')
      })
    }
  }

  abrirConfirmarEliminar(refugio: Refugio): void {
    this.refugioAEliminar.set(refugio)
    this.mostrarConfirm.set(true)
  }

  confirmarEliminar(): void {
    const refugio = this.refugioAEliminar()
    if (!refugio) return

    this.eliminando.set(true)
    this.refugioService.delete(refugio.id_refug).subscribe({
      next: () => {
        this.notificationService.success('✓ Refugio eliminado correctamente')
        this.cerrarConfirm()
        this.cargarRefugios()
      },
      error: () => {
        this.notificationService.error('Error al eliminar el refugio')
        this.eliminando.set(false)
      }
    })
  }

  cerrarConfirm(): void {
    this.mostrarConfirm.set(false)
    this.refugioAEliminar.set(null)
    this.eliminando.set(false)
  }
}