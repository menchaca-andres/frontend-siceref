import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { RefugioService } from '../../../shared/services/refugios/refugio.service'
import { Refugio } from '../../../core/models/refugios/refugio.model'
import { AuthStore } from '../../../core/store/auth.store'
import { TablePaginationComponent } from '../../../shared/components/table-pagination/table-pagination'
import { removeItemAndFixPage } from '../../../shared/utils/list-pagination.helper'

@Component({
  selector: 'app-refugios',
  imports: [ReactiveFormsModule, TablePaginationComponent],
  templateUrl: './refugios.html',
  styleUrl: './refugios.scss'
})
export class RefugiosComponent implements OnInit {
  private refugioService = inject(RefugioService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  refugios = signal<Refugio[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  refugioEditando = signal<Refugio | null>(null)
  selectedImage = signal<File | null>(null)
  imagePreviewUrl = signal<string | null>(null)
  pageSize = 5
  page = signal(1)
  refugiosPaginados = computed(() => this.refugios().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize))

  form: FormGroup = this.fb.group({
    nom_ref: ['', Validators.required],
    direc_ref: ['', Validators.required],
    telef_ref: ['', Validators.required],
    email_ref: ['', [Validators.required, Validators.email]],
    estado_ref: [true, Validators.required]
  })

  ngOnInit(): void {
    this.cargarRefugios()
  }

  cargarRefugios(): void {
    this.loading.set(true)
    this.refugioService.getAll().subscribe({
      next: (data) => {
        this.refugios.set(data)
        this.page.set(1)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error.message || 'Error al cargar refugios')
        this.loading.set(false)
      }
    })
  }

  abrirFormCrear(): void {
    this.refugioEditando.set(null)
    this.clearSelectedImage()
    this.form.reset({ estado_ref: true })
    this.mostrarForm.set(true)
  }

  abrirFormEditar(refugio: Refugio): void {
    this.refugioEditando.set(refugio)
    this.clearSelectedImage()
    this.form.patchValue(refugio)
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

    const editando = this.refugioEditando()

    if (editando) {
      this.refugioService.update(editando.id_ref, this.buildPayload()).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarRefugios()
        },
        error: (err) => this.error.set(err.error.message)
      })
    } else {
      this.refugioService.create(this.buildPayload()).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarRefugios()
        },
        error: (err) => this.error.set(err.error.message)
      })
    }
  }

  private buildPayload() {
    const image = this.selectedImage()
    if (!image) return this.form.value

    const formData = new FormData()
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    formData.append('img_ref', image)

    return formData
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este refugio?')) return

    this.refugioService.delete(id).subscribe({
      next: () => {
        const result = removeItemAndFixPage(
          this.refugios(),
          this.page(),
          this.pageSize,
          (refugio) => refugio.id_ref === id,
        )
        this.refugios.set(result.items)
        this.page.set(result.page)
      },
      error: (err) => this.error.set(err.error.message)
    })
  }
}
