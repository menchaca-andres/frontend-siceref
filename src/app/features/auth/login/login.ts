import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthStore } from '../../../core/store/auth.store'
import { AuthService } from '../../../shared/services/auth/auth.service'
import { NotificationService } from '../../../shared/services/notification.service'

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
  private notificationService = inject(NotificationService)

  form: FormGroup = this.fb.group({
    corr_usuario: ['', [Validators.required, Validators.email]],
    contra_usuario: ['', [Validators.required, Validators.minLength(6)]]
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
        this.notificationService.success('¡Bienvenido!')
        this.redirigirPorRol(response.usuario.nom_rol)
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al iniciar sesión. Intenta de nuevo.'
        if (this.error) {
          this.notificationService.error(this.error)
        }
        this.loading = false
      }
    })
  }

  private redirigirPorRol(rol: string): void {
    switch (rol) {
      case 'Superadmin':
        this.router.navigate(['/superadmin/refugios'])
        break
      case 'Administrador Refugio':
      case 'Trabajador Refugio':
        this.router.navigate(['/refugio/mascotas'])
        break
      case 'Adoptante':
        this.router.navigate(['/adoptante/perfil'])
        break
      default:
        this.router.navigate(['/home'])
    }
  }
}