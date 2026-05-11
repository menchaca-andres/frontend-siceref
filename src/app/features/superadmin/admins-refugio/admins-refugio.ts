import { Component, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Refugio } from '../../../core/models/refugios/refugio.model'
import { AuthStore } from '../../../core/store/auth.store'
import { AuthService } from '../../../shared/services/auth/auth.service'
import { RefugioService } from '../../../shared/services/refugios/refugio.service'

@Component({
  selector: 'app-admins-refugio',
  imports: [ReactiveFormsModule],
  templateUrl: './admins-refugio.html'
})
export class AdminsRefugioComponent implements OnInit {
  private authService = inject(AuthService)
  private refugioService = inject(RefugioService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  refugios = signal<Refugio[]>([])
  error = signal<string | null>(null)
  success = signal<string | null>(null)
  loading = signal(false)

  form: FormGroup = this.fb.group({
    id_ref: [null, Validators.required],
    nom_usu: ['', Validators.required],
    apell_usu: ['', Validators.required],
    email_usu: ['', [Validators.required, Validators.email]],
    pass_usu: ['', [Validators.required, Validators.minLength(6)]],
    numcel_usu: ['', Validators.required],
    fecnac_usu: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarRefugios()
  }

  cargarRefugios(): void {
    this.refugioService.getAll().subscribe({
      next: (data) => this.refugios.set(data),
      error: (err) => this.error.set(err.error?.message || 'Error al cargar refugios')
    })
  }

  onSubmit(): void {
    if (this.form.invalid) return

    this.loading.set(true)
    this.error.set(null)
    this.success.set(null)

    this.authService.registerAdminRefugio(this.form.value).subscribe({
      next: (response) => {
        this.success.set(response.message)
        this.form.reset()
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Error al crear administrador de refugio')
        this.loading.set(false)
      }
    })
  }
}
