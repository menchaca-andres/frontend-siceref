import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../../shared/services/auth/auth.service'
import { AuthStore } from '../../../core/store/auth.store'

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: "./login.scss",
})
export class LoginComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private authStore = inject(AuthStore)
  private router = inject(Router)

  form: FormGroup = this.fb.group({
    email_usu: ['', [Validators.required, Validators.email]],
    pass_usu: ['', [Validators.required, Validators.minLength(6)]]
  })

  error: string | null = null
  loading = false

  onSubmit(): void {
    if (this.form.invalid) return

    this.loading = true
    this.error = null

    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        this.authStore.setUsuario(response)
        this.redirigirPorPermisos(response.usuario.permisos)
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al iniciar sesión'
        this.loading = false
      }
    })
  }

  private redirigirPorPermisos(permisos: string[]): void {
    if (permisos.includes('refugios:obtener')) {
      this.router.navigate(['/superadmin/refugios'])
      return
    }

    if (permisos.includes('mascotas:obtener')) {
      this.router.navigate(['/refugio/mascotas'])
      return
    }

    if (permisos.includes('perfil:obtener')) {
      this.router.navigate(['/adoptante/perfil'])
      return
    }

    this.router.navigate(['/home'])
  }
}
