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
  selectedImage = signal<File | null>(null)
  imagePreviewUrl = signal<string | null>(null)

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

    this.authService.registerSuperadmin(this.buildPayload()).subscribe({
      next: (response) => {
        this.success.set(response.message)
        this.form.reset()
        this.clearSelectedImage()
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al crear administrador')
        this.loading.set(false)
      }
    })
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0] ?? null
    this.clearSelectedImage()
    this.selectedImage.set(file)

    if (file) {
      this.imagePreviewUrl.set(URL.createObjectURL(file))
    }
  }

  private clearSelectedImage(): void {
    const previewUrl = this.imagePreviewUrl()
    if (previewUrl) URL.revokeObjectURL(previewUrl)

    this.selectedImage.set(null)
    this.imagePreviewUrl.set(null)
  }

  private buildPayload() {
    const image = this.selectedImage()
    if (!image) return this.form.value

    const formData = new FormData()
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    formData.append('img_usu', image)

    return formData
  }
}
