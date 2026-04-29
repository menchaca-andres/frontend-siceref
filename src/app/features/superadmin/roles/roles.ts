import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Rol } from '../../../core/models/roles/rol.model'
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component'
import { NotificationService } from '../../../shared/services/notification.service'
import { RolService } from '../../../shared/services/roles/rol.service'

@Component({
  selector: 'app-roles',
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './roles.html',
  styleUrl: './roles.scss'
})
export class RolesComponent implements OnInit {
  private rolService = inject(RolService)
  private fb = inject(FormBuilder)
  private notificationService = inject(NotificationService)

  roles = signal<Rol[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  rolEditando = signal<Rol | null>(null)
  mostrarConfirm = signal(false)
  rolAEliminar = signal<Rol | null>(null)
  eliminando = signal(false)

  form: FormGroup = this.fb.group({
    nom_rol: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarRoles()
  }

  cargarRoles(): void {
    this.loading.set(true)
    this.rolService.getAll().subscribe({
      next: (data) => {
        this.roles.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.notificationService.error('Error al cargar los roles')
        this.loading.set(false)
      }
    })
  }

  abrirFormCrear(): void {
    this.rolEditando.set(null)
    this.form.reset()
    this.mostrarForm.set(true)
  }

  abrirFormEditar(rol: Rol): void {
    this.rolEditando.set(rol)
    this.form.patchValue(rol)
    this.mostrarForm.set(true)
  }

  cerrarForm(): void {
    this.mostrarForm.set(false)
    this.form.reset()
  }

  onSubmit(): void {
    if (this.form.invalid) return

    const editando = this.rolEditando()

    if (editando) {
      this.rolService.update(editando.id_rol, this.form.value).subscribe({
        next: () => {
          this.notificationService.success('✓ Rol actualizado correctamente')
          this.cerrarForm()
          this.cargarRoles()
        },
        error: () => this.notificationService.error('Error al actualizar el rol')
      })
    } else {
      this.rolService.create(this.form.value).subscribe({
        next: () => {
          this.notificationService.success('✓ Rol creado correctamente')
          this.cerrarForm()
          this.cargarRoles()
        },
        error: () => this.notificationService.error('Error al crear el rol')
      })
    }
  }

  abrirConfirmarEliminar(rol: Rol): void {
    this.rolAEliminar.set(rol)
    this.mostrarConfirm.set(true)
  }

  confirmarEliminar(): void {
    const rol = this.rolAEliminar()
    if (!rol) return

    this.eliminando.set(true)
    this.rolService.delete(rol.id_rol).subscribe({
      next: () => {
        this.notificationService.success('✓ Rol eliminado correctamente')
        this.cerrarConfirm()
        this.cargarRoles()
      },
      error: () => {
        this.notificationService.error('Error al eliminar el rol')
        this.eliminando.set(false)
      }
    })
  }

  cerrarConfirm(): void {
    this.mostrarConfirm.set(false)
    this.rolAEliminar.set(null)
    this.eliminando.set(false)
  }
}