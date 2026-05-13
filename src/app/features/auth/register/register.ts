import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../../shared/services/auth/auth.service'
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar'

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, PublicNavbarComponent],
  templateUrl: './register.html',
  styleUrl: "./register.scss"
})
export class RegisterComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  form: FormGroup = this.fb.group({
    nom_usu: ['', Validators.required],
    apell_usu: ['', Validators.required],
    email_usu: ['', [Validators.required, Validators.email]],
    pass_usu: ['', [Validators.required, Validators.minLength(6)]],
    numcel_usu: ['', Validators.required],
    fecnac_usu: ['', Validators.required]
  })

  error: string | null = null
  success: string | null = null
  loading = false
  showPassword = false

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  onSubmit(): void {
    if (this.form.invalid) return

    this.loading = true
    this.error = null
    this.success = null

    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.success = 'Registro exitoso, ya puedes iniciar sesión'
        this.loading = false
        setTimeout(() => this.router.navigate(['/auth/login']), 2000)
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al registrarse'
        this.loading = false
      }
    })
  }
}
