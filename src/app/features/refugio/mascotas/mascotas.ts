import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Mascota } from '../../../core/models/mascotas/mascota.model'
import { Raza } from '../../../core/models/razas/raza.model'
import { AuthStore } from '../../../core/store/auth.store'
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component'
import { MascotaService } from '../../../shared/services/mascotas/mascota.service'
import { NotificationService } from '../../../shared/services/notification.service'
import { RazaService } from '../../../shared/services/razas/raza.service'

@Component({
  selector: 'app-mascotas',
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.scss'
})
export class MascotasComponent implements OnInit {
  private mascotaService = inject(MascotaService)
  private razaService = inject(RazaService)
  private fb = inject(FormBuilder)
  private notificationService = inject(NotificationService)
  authStore = inject(AuthStore)

  mascotas = signal<Mascota[]>([])
  razas = signal<Raza[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  mascotaEditando = signal<Mascota | null>(null)
  mostrarConfirm = signal(false)
  mascotaAEliminar = signal<Mascota | null>(null)
  eliminando = signal(false)

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
        this.notificationService.error('Error al cargar las mascotas')
        this.loading.set(false)
      }
    })
  }

  cargarRazas(): void {
    this.razaService.getAll().subscribe({
      next: (data) => this.razas.set(data),
      error: () => this.notificationService.error('Error al cargar las razas')
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
          this.notificationService.success('Mascota actualizada correctamente')
          this.cerrarForm()
          this.cargarMascotas()
        },
        error: () => this.notificationService.error('Error al actualizar la mascota')
      })
    } else {
      this.mascotaService.create(this.form.value).subscribe({
        next: () => {
          this.notificationService.success('Mascota creada correctamente')
          this.cerrarForm()
          this.cargarMascotas()
        },
        error: () => this.notificationService.error('Error al crear la mascota')
      })
    }
  }

  abrirConfirmarEliminar(mascota: Mascota): void {
    this.mascotaAEliminar.set(mascota)
    this.mostrarConfirm.set(true)
  }

  confirmarEliminar(): void {
    const mascota = this.mascotaAEliminar()
    if (!mascota) return

    this.eliminando.set(true)
    this.mascotaService.delete(mascota.id_mascot).subscribe({
      next: () => {
        this.notificationService.success('Mascota eliminada correctamente')
        this.cerrarConfirm()
        this.cargarMascotas()
      },
      error: () => {
        this.notificationService.error('Error al eliminar la mascota')
        this.eliminando.set(false)
      }
    })
  }

  cerrarConfirm(): void {
    this.mostrarConfirm.set(false)
    this.mascotaAEliminar.set(null)
    this.eliminando.set(false)
  }
}