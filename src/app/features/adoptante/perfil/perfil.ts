import { CommonModule, DatePipe } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Usuario } from '../../../core/models/usuarios/usuario.model'
import { AuthStore } from '../../../core/store/auth.store'
import { NotificationService } from '../../../shared/services/notification.service'
import { UsuarioService } from '../../../shared/services/usuarios/usuario.service'

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class PerfilComponent implements OnInit {
  private usuarioService = inject(UsuarioService)
  private fb = inject(FormBuilder)
  private notificationService = inject(NotificationService)
  authStore = inject(AuthStore)

  usuario = signal<Usuario | null>(null)
  loading = signal(false)
  error = signal<string | null>(null)
  editando = signal(false)

  form: FormGroup = this.fb.group({
    nom_usuario: ['', Validators.required],
    apell_usuario: ['', Validators.required],
    corr_usuario: ['', [Validators.required, Validators.email]],
    telf_usuario: ['', Validators.required],
    direc_usuario: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarPerfil()
  }

  cargarPerfil(): void {
    const id = this.authStore.id_usuario()
    if (!id) return

    this.loading.set(true)
    this.usuarioService.getById(id).subscribe({
      next: (data) => {
        this.usuario.set(data)
        this.form.patchValue(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.notificationService.error('Error al cargar el perfil')
        this.loading.set(false)
      }
    })
  }

  activarEdicion(): void {
    this.editando.set(true)
  }

  cancelarEdicion(): void {
    this.editando.set(false)
    const u = this.usuario()
    if (u) this.form.patchValue(u)
  }

  onSubmit(): void {
    if (this.form.invalid) return

    const id = this.authStore.id_usuario()
    if (!id) return

    this.loading.set(true)
    this.usuarioService.update(id, this.form.value).subscribe({
      next: (data) => {
        this.usuario.set(data)
        this.editando.set(false)
        this.notificationService.success('✓ Perfil actualizado correctamente')
        this.loading.set(false)
      },
      error: (err) => {
        this.notificationService.error('Error al actualizar el perfil')
        this.loading.set(false)
      }
    })
  }
}