import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { UsuarioService } from '../../../shared/services/usuarios/usuario.service'
import { AuthStore } from '../../../core/store/auth.store'
import { Usuario } from '../../../core/models/usuarios/usuario.model'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class PerfilComponent implements OnInit {
  private usuarioService = inject(UsuarioService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  usuario = signal<Usuario | null>(null)
  loading = signal(false)
  error = signal<string | null>(null)
  success = signal<string | null>(null)
  campoEditando = signal<string | null>(null)
  selectedImage = signal<File | null>(null)
  imagePreviewUrl = signal<string | null>(null)

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
    this.campoEditando.set('perfil')
    this.success.set(null)
    this.error.set(null)
    this.clearSelectedImage()
  }

  cancelarEdicion(): void {
    this.campoEditando.set(null)
    this.clearSelectedImage()
    const u = this.usuario()
    if (u) this.patchForm(u)
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

  guardarEdicion(): void {
    if (this.form.invalid) return

    const id = this.authStore.id_usu()
    if (!id) return

    this.usuarioService.update(id, this.buildPayload()).subscribe({
      next: (data) => {
        this.usuario.set(data)
        this.authStore.updateUsuarioBasico(data)
        this.campoEditando.set(null)
        this.clearSelectedImage()
        this.success.set('Perfil actualizado correctamente')
      },
      error: (err) => {
        this.error.set(err.error.message)
      }
    })
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
