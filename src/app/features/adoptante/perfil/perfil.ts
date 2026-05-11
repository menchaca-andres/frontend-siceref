import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { UsuarioService } from '../../../shared/services/usuarios/usuario.service'
import { AuthStore } from '../../../core/store/auth.store'
import { Usuario } from '../../../core/models/usuarios/usuario.model'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './perfil.html'
})
export class PerfilComponent implements OnInit {
  private usuarioService = inject(UsuarioService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  usuario = signal<Usuario | null>(null)
  loading = signal(false)
  error = signal<string | null>(null)
  success = signal<string | null>(null)
  editando = signal(false)

  form: FormGroup = this.fb.group({
    nom_usu: ['', Validators.required],
    apell_usu: ['', Validators.required],
    email_usu: ['', [Validators.required, Validators.email]],
    numcel_usu: ['', Validators.required],
    fecnac_usu: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarPerfil()
  }

  cargarPerfil(): void {
    const id = this.authStore.id_usu()
    if (!id) return

    this.loading.set(true)
    this.usuarioService.getById(id).subscribe({
      next: (data) => {
        this.usuario.set(data)
        this.patchForm(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error.message)
        this.loading.set(false)
      }
    })
  }

  activarEdicion(): void {
    this.editando.set(true)
    this.success.set(null)
    this.error.set(null)
  }

  cancelarEdicion(): void {
    this.editando.set(false)
    const u = this.usuario()
    if (u) this.patchForm(u)
  }

  onSubmit(): void {
    if (this.form.invalid) return

    const id = this.authStore.id_usu()
    if (!id) return

    this.usuarioService.update(id, this.form.value).subscribe({
      next: (data) => {
        this.usuario.set(data)
        this.editando.set(false)
        this.success.set('Perfil actualizado correctamente')
      },
      error: (err) => {
        this.error.set(err.error.message)
      }
    })
  }

  private patchForm(usuario: Usuario): void {
    this.form.patchValue({
      nom_usu: usuario.nom_usu,
      apell_usu: usuario.apell_usu,
      email_usu: usuario.email_usu,
      numcel_usu: usuario.numcel_usu,
      fecnac_usu: this.toDateInputValue(usuario.fecnac_usu)
    })
  }

  private toDateInputValue(value: Date | string): string {
    return new Date(value).toISOString().slice(0, 10)
  }
}
