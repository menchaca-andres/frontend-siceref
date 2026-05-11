import { DatePipe } from '@angular/common'
import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthStore } from '../../../core/store/auth.store'
import { Usuario } from '../../../core/models/usuarios/usuario.model'
import { AuthService } from '../../../shared/services/auth/auth.service'
import { UsuarioService } from '../../../shared/services/usuarios/usuario.service'

@Component({
  selector: 'app-trabajadores',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './trabajadores.html'
})
export class TrabajadoresComponent implements OnInit {
  private usuarioService = inject(UsuarioService)
  private authService = inject(AuthService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  trabajadores = signal<Usuario[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  success = signal<string | null>(null)
  mostrarForm = signal(false)

  form: FormGroup = this.fb.group({
    nom_usu: ['', Validators.required],
    apell_usu: ['', Validators.required],
    email_usu: ['', [Validators.required, Validators.email]],
    pass_usu: ['', [Validators.required, Validators.minLength(6)]],
    numcel_usu: ['', Validators.required],
    fecnac_usu: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarTrabajadores()
  }

  cargarTrabajadores(): void {
    this.loading.set(true)
    this.usuarioService.getMyWorkers().subscribe({
      next: (data) => {
        this.trabajadores.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar trabajadores')
        this.loading.set(false)
      }
    })
  }

  abrirFormCrear(): void {
    this.error.set(null)
    this.success.set(null)
    this.form.reset()
    this.mostrarForm.set(true)
  }

  cerrarForm(): void {
    this.mostrarForm.set(false)
    this.form.reset()
  }

  onSubmit(): void {
    const idRef = this.authStore.id_ref()
    if (this.form.invalid || !idRef) return

    this.authService.registerWorker({ ...this.form.value, id_ref: idRef }).subscribe({
      next: (response) => {
        this.success.set(response.message)
        this.cerrarForm()
        this.cargarTrabajadores()
      },
      error: (err) => this.error.set(err.error?.message || 'Error al registrar trabajador')
    })
  }
}
