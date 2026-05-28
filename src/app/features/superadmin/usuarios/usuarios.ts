import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { UsuarioService } from '../../../shared/services/usuarios/usuario.service'
import { Usuario } from '../../../core/models/usuarios/usuario.model'
import { AuthStore } from '../../../core/store/auth.store'
import { DatePipe } from '@angular/common'
import { TablePaginationComponent } from '../../../shared/components/table-pagination/table-pagination'

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule, DatePipe, TablePaginationComponent],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  usuarios = signal<Usuario[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  usuarioEditando = signal<Usuario | null>(null)
  selectedImage = signal<File | null>(null)
  imagePreviewUrl = signal<string | null>(null)
  pageSize = 5
  page = signal(1)
  usuariosPaginados = computed(() => this.usuarios().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize))

  form: FormGroup = this.fb.group({
    nom_usu: ['', Validators.required],
    apell_usu: ['', Validators.required],
    email_usu: ['', [Validators.required, Validators.email]],
    numcel_usu: ['', Validators.required],
    fecnac_usu: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarUsuarios()
  }

  cargarUsuarios(): void {
    this.loading.set(true)
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios.set(data)
        this.page.set(1)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error.message)
        this.loading.set(false)
      }
    })
  }

  abrirFormEditar(usuario: Usuario): void {
    this.usuarioEditando.set(usuario)
    this.clearSelectedImage()
    this.form.patchValue({
      nom_usu: usuario.nom_usu,
      apell_usu: usuario.apell_usu,
      email_usu: usuario.email_usu,
      numcel_usu: usuario.numcel_usu,
      fecnac_usu: this.toDateInputValue(usuario.fecnac_usu)
    })
    this.mostrarForm.set(true)
  }

  cerrarForm(): void {
    this.mostrarForm.set(false)
    this.clearSelectedImage()
    this.form.reset()
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

  onSubmit(): void {
    if (this.form.invalid) return

    const editando = this.usuarioEditando()
    if (!editando) return

    this.usuarioService.update(editando.id_usu, this.buildPayload()).subscribe({
      next: (data) => {
        if (data.id_usu === this.authStore.id_usu()) {
          this.authStore.updateUsuarioBasico(data)
        }

        this.cerrarForm()
        this.cargarUsuarios()
      },
      error: (err) => this.error.set(err.error.message)
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

  private toDateInputValue(value: Date | string): string {
    return new Date(value).toISOString().slice(0, 10)
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return

    this.usuarioService.delete(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => this.error.set(err.error.message)
    })
  }
}
