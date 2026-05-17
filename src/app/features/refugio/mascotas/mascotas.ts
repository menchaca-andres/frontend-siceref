import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { MascotaService } from '../../../shared/services/mascotas/mascota.service'
import { RazaService } from '../../../shared/services/razas/raza.service'
import { TamanioService } from '../../../shared/services/tamanios/tamanio.service'
import { Mascota } from '../../../core/models/mascotas/mascota.model'
import { Raza } from '../../../core/models/razas/raza.model'
import { Tamanio } from '../../../core/models/tamanios/tamanio.model'
import { AuthStore } from '../../../core/store/auth.store'

@Component({
  selector: 'app-mascotas',
  imports: [ReactiveFormsModule],
  templateUrl: './mascotas.html',
  styleUrl: './mascotas.scss'
})
export class MascotasComponent implements OnInit {
  private mascotaService = inject(MascotaService)
  private razaService = inject(RazaService)
  private tamanioService = inject(TamanioService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  mascotas = signal<Mascota[]>([])
  razas = signal<Raza[]>([])
  tamanios = signal<Tamanio[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  mascotaEditando = signal<Mascota | null>(null)
  selectedImage = signal<File | null>(null)
  imagePreviewUrl = signal<string | null>(null)

  form: FormGroup = this.fb.group({
    id_raza: ['', Validators.required],
    id_tam: ['', Validators.required],
    nom_mascot: ['', Validators.required],
    fechanac_mascot: ['', Validators.required],
    caract_mascot: ['', Validators.required],
    sexo_mascot: ['Macho', Validators.required],
    esteril_mascot: [false, Validators.required]
  })

  ngOnInit(): void {
    this.cargarMascotas()
    this.cargarRazas()
    this.cargarTamanios()
  }

  cargarMascotas(): void {
    this.loading.set(true)
    this.mascotaService.getAll().subscribe({
      next: (data) => {
        this.mascotas.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error.message)
        this.loading.set(false)
      }
    })
  }

  cargarRazas(): void {
    this.razaService.getAll().subscribe({
      next: (data) => this.razas.set(data)
    })
  }

  cargarTamanios(): void {
    this.tamanioService.getAll().subscribe({
      next: (data) => this.tamanios.set(data)
    })
  }

  abrirFormCrear(): void {
    this.mascotaEditando.set(null)
    this.clearSelectedImage()
    this.form.reset({ sexo_mascot: 'Macho', esteril_mascot: false })
    this.mostrarForm.set(true)
  }

  abrirFormEditar(mascota: Mascota): void {
    this.mascotaEditando.set(mascota)
    this.clearSelectedImage()
    this.form.patchValue({
      id_raza: mascota.id_raza,
      id_tam: mascota.id_tam,
      nom_mascot: mascota.nom_mascot,
      fechanac_mascot: this.toDateInputValue(mascota.fechanac_mascot),
      caract_mascot: mascota.caract_mascot,
      sexo_mascot: mascota.sexo_mascot,
      esteril_mascot: mascota.esteril_mascot
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

  useImageFallback(event: Event): void {
    const image = event.target as HTMLImageElement
    image.style.display = 'none'
    image.nextElementSibling?.classList.remove('hidden')
  }

  onSubmit(): void {
    if (this.form.invalid) return

    const editando = this.mascotaEditando()
    const formData = this.buildFormData(editando)
    if (!formData) return

    if (editando) {
      this.mascotaService.update(editando.id_ani, formData).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarMascotas()
        },
        error: (err) => this.error.set(err.error.message)
      })
    } else {
      this.mascotaService.create(formData).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarMascotas()
        },
        error: (err) => this.error.set(err.error.message)
      })
    }
  }

  calcularEdad(fechaNacimiento: Date | string): number {
    const nacimiento = new Date(fechaNacimiento)
    const hoy = new Date()
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }

    return edad
  }

  private buildFormData(editando: Mascota | null): FormData | null {
    const idRef = this.authStore.id_ref()
    const image = this.selectedImage()

    if (!idRef) {
      this.error.set('No hay un refugio asociado a tu usuario')
      return null
    }

    if (!editando && !image) {
      this.error.set('La imagen de la mascota es obligatoria')
      return null
    }

    const formData = new FormData()
    formData.append('nom_mascot', this.form.value.nom_mascot)
    formData.append('fechanac_mascot', this.form.value.fechanac_mascot)
    formData.append('esteril_mascot', String(this.form.value.esteril_mascot))
    formData.append('sexo_mascot', this.form.value.sexo_mascot)
    formData.append('caract_mascot', this.form.value.caract_mascot)
    formData.append('id_raza', String(this.form.value.id_raza))
    formData.append('id_tam', String(this.form.value.id_tam))
    formData.append('id_ref', String(idRef))

    if (image) {
      formData.append('img_mascot', image)
    }

    return formData
  }

  private toDateInputValue(value: Date | string): string {
    return new Date(value).toISOString().slice(0, 10)
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return

    this.mascotaService.delete(id).subscribe({
      next: () => this.cargarMascotas(),
      error: (err) => this.error.set(err.error.message)
    })
  }
}
