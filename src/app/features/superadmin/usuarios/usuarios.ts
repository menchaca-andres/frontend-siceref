import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { UsuarioService } from '../../../shared/services/usuarios/usuario.service'
import { Usuario } from '../../../core/models/usuarios/usuario.model'

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule],
  templateUrl: './usuarios.html'
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService)
  private fb = inject(FormBuilder)

  usuarios = signal<Usuario[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  usuarioEditando = signal<Usuario | null>(null)

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
        this.error.set(err.error.message)
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
        this.cerrarForm()
        this.cargarUsuarios()
      },
      error: (err) => this.error.set(err.error.message)
    })
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return

    this.usuarioService.delete(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => this.error.set(err.error.message)
    })
  }
}