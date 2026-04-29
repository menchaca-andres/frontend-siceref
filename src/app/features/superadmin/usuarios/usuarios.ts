import { CommonModule } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Usuario } from '../../../core/models/usuarios/usuario.model'
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component'
import { NotificationService } from '../../../shared/services/notification.service'
import { UsuarioService } from '../../../shared/services/usuarios/usuario.service'

@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, ReactiveFormsModule, ConfirmDialogComponent],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService)
  private fb = inject(FormBuilder)
  private notificationService = inject(NotificationService)

  usuarios = signal<Usuario[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  usuarioEditando = signal<Usuario | null>(null)
  mostrarConfirm = signal(false)
  usuarioAEliminar = signal<Usuario | null>(null)
  eliminando = signal(false)

  form: FormGroup = this.fb.group({
    nom_usuario: ['', Validators.required],
    apell_usuario: ['', Validators.required],
    corr_usuario: ['', [Validators.required, Validators.email]],
    telf_usuario: ['', Validators.required],
    direc_usuario: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarUsuarios()
  }

  cargarUsuarios(): void {
    this.loading.set(true)
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.notificationService.error('Error al cargar los usuarios')
        this.loading.set(false)
      }
    })
  }

  abrirFormEditar(usuario: Usuario): void {
    this.usuarioEditando.set(usuario)
    this.form.patchValue(usuario)
    this.mostrarForm.set(true)
  }

  cerrarForm(): void {
    this.mostrarForm.set(false)
    this.form.reset()
  }

  onSubmit(): void {
    if (this.form.invalid) return

    const editando = this.usuarioEditando()
    if (!editando) return

    this.usuarioService.update(editando.id_usuario, this.form.value).subscribe({
      next: () => {
        this.notificationService.success('✓ Usuario actualizado correctamente')
        this.cerrarForm()
        this.cargarUsuarios()
      },
      error: () => this.notificationService.error('Error al actualizar el usuario')
    })
  }

  abrirConfirmarEliminar(usuario: Usuario): void {
    this.usuarioAEliminar.set(usuario)
    this.mostrarConfirm.set(true)
  }

  confirmarEliminar(): void {
    const usuario = this.usuarioAEliminar()
    if (!usuario) return

    this.eliminando.set(true)
    this.usuarioService.delete(usuario.id_usuario).subscribe({
      next: () => {
        this.notificationService.success('✓ Usuario eliminado correctamente')
        this.cerrarConfirm()
        this.cargarUsuarios()
      },
      error: () => {
        this.notificationService.error('Error al eliminar el usuario')
        this.eliminando.set(false)
      }
    })
  }

  cerrarConfirm(): void {
    this.mostrarConfirm.set(false)
    this.usuarioAEliminar.set(null)
    this.eliminando.set(false)
  }
}