import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { RolService } from '../../../shared/services/roles/rol.service'
import { Rol } from '../../../core/models/roles/rol.model'
import { AuthStore } from '../../../core/store/auth.store'
import { TablePaginationComponent } from '../../../shared/components/table-pagination/table-pagination'

@Component({
  selector: 'app-roles',
  imports: [ReactiveFormsModule, TablePaginationComponent],
  templateUrl: './roles.html'
})
export class RolesComponent implements OnInit {
  private rolService = inject(RolService)
  private fb = inject(FormBuilder)
  authStore = inject(AuthStore)

  roles = signal<Rol[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  mostrarForm = signal(false)
  rolEditando = signal<Rol | null>(null)
  pageSize = 5
  page = signal(1)
  rolesPaginados = computed(() => this.roles().slice((this.page() - 1) * this.pageSize, this.page() * this.pageSize))

  form: FormGroup = this.fb.group({
    codigo: ['', Validators.required],
    nom_rol: ['', Validators.required],
    descrip_rol: ['', Validators.required]
  })

  ngOnInit(): void {
    this.cargarRoles()
  }

  cargarRoles(): void {
    this.loading.set(true)
    this.rolService.getAll().subscribe({
      next: (data) => {
        this.roles.set(data)
        this.page.set(1)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error.message)
        this.loading.set(false)
      }
    })
  }

  abrirFormCrear(): void {
    this.rolEditando.set(null)
    this.form.reset()
    this.mostrarForm.set(true)
  }

  abrirFormEditar(rol: Rol): void {
    this.rolEditando.set(rol)
    this.form.patchValue(rol)
    this.mostrarForm.set(true)
  }

  cerrarForm(): void {
    this.mostrarForm.set(false)
    this.form.reset()
  }

  onSubmit(): void {
    if (this.form.invalid) return

    const editando = this.rolEditando()

    if (editando) {
      this.rolService.update(editando.id_rol, this.form.value).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarRoles()
        },
        error: (err) => this.error.set(err.error.message)
      })
    } else {
      this.rolService.create(this.form.value).subscribe({
        next: () => {
          this.cerrarForm()
          this.cargarRoles()
        },
        error: (err) => this.error.set(err.error.message)
      })
    }
  }

  eliminar(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este rol?')) return

    this.rolService.delete(id).subscribe({
      next: () => this.cargarRoles(),
      error: (err) => this.error.set(err.error.message)
    })
  }
}
