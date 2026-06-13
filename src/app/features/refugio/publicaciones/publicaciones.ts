import { DatePipe } from '@angular/common'
import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Mascota } from '../../../core/models/mascotas/mascota.model'
import { Publicacion } from '../../../core/models/publicaciones/publicacion.model'
import { AuthStore } from '../../../core/store/auth.store'
import { MascotaService } from '../../../shared/services/mascotas/mascota.service'
import { PublicacionService } from '../../../shared/services/publicaciones/publicacion.service'
import { TablePaginationComponent } from '../../../shared/components/table-pagination/table-pagination'
import { removeItemAndFixPage } from '../../../shared/utils/list-pagination.helper'

@Component({
  selector: 'app-publicaciones',
  imports: [ReactiveFormsModule, DatePipe, TablePaginationComponent],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.scss'
})
export class PublicacionesComponent implements OnInit {
  private publicacionService = inject(PublicacionService)
  private mascotaService = inject(MascotaService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  publicaciones = signal<Publicacion[]>([])
  mascotas = signal<Mascota[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  publicacionEditando = signal<Publicacion | null>(null)
  pageSize = 5
  page = signal(1)
  publicacionesPaginadas = computed(() => this.publicaciones().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize))

  form: FormGroup = this.fb.group({
    id_ani: [null, Validators.required],
    estad_publ: [true, Validators.required]
  })

  ngOnInit(): void {
    this.cargarPublicaciones()
    this.cargarMascotas()
  }

  cargarPublicaciones(): void {
    this.loading.set(true)
    this.publicacionService.getMine().subscribe({
      next: (data) => {
        this.publicaciones.set(data)
        this.page.set(1)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al cargar publicaciones')
        this.loading.set(false)
      }
    })
  }

  cargarMascotas(): void {
    this.mascotaService.getAll().subscribe({
      next: (data) => this.mascotas.set(data),
      error: (err) => this.error.set(err.error?.message || 'Error al cargar mascotas')
    })
  }

  abrirFormCrear(): void {
    this.publicacionEditando.set(null)
    this.form.reset({ id_ani: null, estad_publ: true })
    this.error.set(null)
    this.mostrarForm.set(true)
  }

  abrirFormEditar(publicacion: Publicacion): void {
    this.publicacionEditando.set(publicacion)
    this.form.patchValue({
      id_ani: publicacion.id_ani,
      estad_publ: publicacion.estad_publ
    })
    this.error.set(null)
    this.mostrarForm.set(true)
  }

  cerrarForm(): void {
    this.mostrarForm.set(false)
    this.form.reset({ id_ani: null, estad_publ: true })
  }

  onSubmit(): void {
    if (this.form.invalid) return

    const editando = this.publicacionEditando()
    const payload = {
      ...this.form.value,
      id_ref: this.authStore.id_ref() ?? this.mascotaSeleccionada()?.id_ref
    }

    if (!payload.id_ref) {
      this.error.set('No se pudo determinar el refugio de la publicación')
      return
    }

    if (editando) {
      this.publicacionService.update(editando.id_publi, payload).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarPublicaciones()
        },
        error: (err) => this.error.set(err.error?.message || 'Error al actualizar publicación')
      })
    } else {
      this.publicacionService.create(payload).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarPublicaciones()
        },
        error: (err) => this.error.set(err.error?.message || 'Error al crear publicación')
      })
    }
  }

  useImageFallback(event: Event): void {
    const image = event.target as HTMLImageElement
    image.style.display = 'none'
    image.nextElementSibling?.classList.remove('hidden')
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar esta publicación?')) return

    this.publicacionService.delete(id).subscribe({
      next: () => {
        const result = removeItemAndFixPage(
          this.publicaciones(),
          this.page(),
          this.pageSize,
          (publicacion) => publicacion.id_publi === id,
        )
        this.publicaciones.set(result.items)
        this.page.set(result.page)
      },
      error: (err) => this.error.set(err.error?.message || 'Error al eliminar publicación')
    })
  }

  private mascotaSeleccionada(): Mascota | undefined {
    return this.mascotas().find((mascota) => mascota.id_ani === Number(this.form.value.id_ani))
  }
}
