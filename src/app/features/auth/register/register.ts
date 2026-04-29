import { Component, inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { Router, RouterLink } from '@angular/router'
import { AuthService } from '../../../shared/services/auth/auth.service'

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  form: FormGroup = this.fb.group({
    nom_usuario: ['', Validators.required],
    apell_usuario: ['', Validators.required],
    corr_usuario: ['', [Validators.required, Validators.email]],
    contra_usuario: ['', [Validators.required, Validators.minLength(6)]],
    telf_usuario: ['', Validators.required],
    fenac_usuario: ['', Validators.required],
    gen_usuario: [true, Validators.required],
    direc_usuario: ['', Validators.required]
  })

  error: string | null = null
  success: string | null = null
  loading = false

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
        this.error = err.error.message || 'Error al registrarse'
        this.loading = false
      }
    })
  }
}