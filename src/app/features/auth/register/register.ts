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
  selectedImage: File | null = null
  imagePreviewUrl: string | null = null

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0] ?? null
    this.clearSelectedImage()
    this.selectedImage = file

    if (file) {
      this.imagePreviewUrl = URL.createObjectURL(file)
    }
  }

  private clearSelectedImage(): void {
    if (this.imagePreviewUrl) URL.revokeObjectURL(this.imagePreviewUrl)

    this.selectedImage = null
    this.imagePreviewUrl = null
  }

  onSubmit(): void {
    if (this.form.invalid) return

    this.loading = true
    this.error = null
    this.success = null

    this.authService.register(this.buildPayload()).subscribe({
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

  private buildPayload() {
    if (!this.selectedImage) return this.form.value

    const formData = new FormData()
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    formData.append('img_usu', this.selectedImage)

    return formData
  }
}
