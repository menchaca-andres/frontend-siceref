import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { RefugioService } from '../../../shared/services/refugios/refugio.service'
import { AuthService } from '../../../shared/services/auth/auth.service'
import { Refugio } from '../../../core/models/refugios/refugio.model'

@Component({
  selector: 'app-refugios',
  imports: [ReactiveFormsModule],
  templateUrl: './refugios.html'
})
export class RefugiosComponent implements OnInit {
  private refugioService = inject(RefugioService)
  private authService = inject(AuthService)
  private fb = inject(FormBuilder)

  refugios = signal<Refugio[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  success = signal<string | null>(null)

  mostrarFormRefugio = signal(false)
  mostrarFormAdmin = signal(false)
  refugioEditando = signal<Refugio | null>(null)
  refugioSeleccionado = signal<Refugio | null>(null)

  formRefugio: FormGroup = this.fb.group({
    nom_refug: ['', Validators.required],
    dir_refug: ['', Validators.required],
    telf_refug: ['', Validators.required],
    corr_refug: ['', [Validators.required, Validators.email]],
    contra_refug: ['', Validators.required],
    licencia_refug: ['', Validators.required]
  })

  formAdmin: FormGroup = this.fb.group({
    nom_usuario: ['', Validators.required],
    apell_usuario: ['', Validators.required],
    corr_usuario: ['', [Validators.required, Validators.email]],
    contra_usuario: ['', [Validators.required, Validators.minLength(6)]],
    telf_usuario: ['', Validators.required],
    fenac_usuario: ['', Validators.required],
    gen_usuario: [true, Validators.required],
    direc_usuario: ['', Validators.required],
    id_refug: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarRefugios()
  }

  cargarRefugios(): void {
    this.loading.set(true)
    this.refugioService.getAll().subscribe({
      next: (data) => {
        this.refugios.set(data)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error.message)
        this.loading.set(false)
      }
    })
  }

  abrirFormCrear(): void {
    this.refugioEditando.set(null)
    this.formRefugio.reset()
    this.formRefugio.get('contra_refug')?.setValidators(Validators.required)
    this.formRefugio.get('contra_refug')?.updateValueAndValidity()
    this.mostrarFormRefugio.set(true)
  }

  abrirFormEditar(refugio: Refugio): void {
    this.refugioEditando.set(refugio)
    this.formRefugio.patchValue(refugio)
    this.formRefugio.get('contra_refug')?.clearValidators()
    this.formRefugio.get('contra_refug')?.updateValueAndValidity()
    this.mostrarFormRefugio.set(true)
  }

  abrirFormAdmin(refugio: Refugio): void {
    this.refugioSeleccionado.set(refugio)
    this.formAdmin.reset({ gen_usuario: true })
    this.formAdmin.patchValue({ id_refug: refugio.id_refug })
    this.mostrarFormAdmin.set(true)
  }

  cerrarFormRefugio(): void {
    this.mostrarFormRefugio.set(false)
    this.formRefugio.reset()
  }

  cerrarFormAdmin(): void {
    this.mostrarFormAdmin.set(false)
    this.formAdmin.reset()
  }

  onSubmitRefugio(): void {
    if (this.formRefugio.invalid) return

    const editando = this.refugioEditando()

    if (editando) {
      this.refugioService.update(editando.id_refug, this.formRefugio.value).subscribe({
        next: () => {
          this.cerrarFormRefugio()
          this.cargarRefugios()
        },
        error: (err) => this.error.set(err.error.message)
      })
    } else {
      this.refugioService.create(this.formRefugio.value).subscribe({
        next: () => {
          this.cerrarFormRefugio()
          this.cargarRefugios()
        },
        error: (err) => this.error.set(err.error.message)
      })
    }
  }

  onSubmitAdmin(): void {
    if (this.formAdmin.invalid) return

    this.authService.registerAdminRefugio(this.formAdmin.value).subscribe({
      next: () => {
        this.cerrarFormAdmin()
        this.success.set('Administrador registrado correctamente')
        setTimeout(() => this.success.set(null), 3000)
      },
      error: (err) => this.error.set(err.error.message)
    })
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este refugio?')) return

    this.refugioService.delete(id).subscribe({
      next: () => this.cargarRefugios(),
      error: (err) => this.error.set(err.error.message)
    })
  }
}