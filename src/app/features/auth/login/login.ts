import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../../shared/services/auth/auth.service'
import { AuthStore } from '../../../core/store/auth.store'
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar'

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, PublicNavbarComponent],
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
  showPassword = false
  passwordVisible = false

  onEmailInput() {
    const email = this.form.get('email_usu')?.value;
    this.passwordVisible = email && email.length > 0;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  onSubmit(): void {
    if (this.form.invalid) return

    this.loading = true
    this.error = null

    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        this.authStore.setUsuario(response)
        this.router.navigate(['/home'])
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al iniciar sesión'
        this.loading = false
      }
    })
  }

}
