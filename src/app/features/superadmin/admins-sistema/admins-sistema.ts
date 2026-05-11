import { Component, inject, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthStore } from '../../../core/store/auth.store'
import { AuthService } from '../../../shared/services/auth/auth.service'

@Component({
  selector: 'app-admins-sistema',
  imports: [ReactiveFormsModule],
  templateUrl: './admins-sistema.html'
})
export class AdminsSistemaComponent {
  private authService = inject(AuthService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  error = signal<string | null>(null)
  success = signal<string | null>(null)
  loading = signal(false)

  form: FormGroup = this.fb.group({
    nom_usu: ['', Validators.required],
    apell_usu: ['', Validators.required],
    email_usu: ['', [Validators.required, Validators.email]],
    pass_usu: ['', [Validators.required, Validators.minLength(6)]],
    numcel_usu: ['', Validators.required],
    fecnac_usu: ['', Validators.required]
  })

  onSubmit(): void {
    if (this.form.invalid) return

    this.loading.set(true)
    this.error.set(null)
    this.success.set(null)

    this.authService.registerSuperadmin(this.form.value).subscribe({
      next: (response) => {
        this.success.set(response.message)
        this.form.reset()
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al crear administrador')
        this.loading.set(false)
      }
    })
  }
}
