import { DatePipe } from '@angular/common'
import { Component, OnInit, inject, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AuditLog, AuditLogFilters } from '../../../core/models/logs/log.model'
import { TablePaginationComponent } from '../../../shared/components/table-pagination/table-pagination'
import { LogService } from '../../../shared/services/logs/log.service'

@Component({
  selector: 'app-logs',
  imports: [DatePipe, FormsModule, TablePaginationComponent],
  templateUrl: './logs.html',
  styleUrl: './logs.scss'
})
export class LogsComponent implements OnInit {
  private logService = inject(LogService)

  logs = signal<AuditLog[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  page = signal(1)
  pageSize = 20
  totalItems = signal(0)

  filters = {
    id_usu: null as number | null,
    accion: '',
    entidad: ''
  }

  ngOnInit(): void {
    this.cargarLogs()
  }

  cargarLogs(page = this.page()): void {
    this.loading.set(true)
    this.error.set(null)

    this.logService.getAll(this.buildFilters(page)).subscribe({
      next: (response) => {
        this.logs.set(response.items)
        this.page.set(response.page)
        this.totalItems.set(response.total)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set(err.error?.message ?? 'No se pudieron cargar los logs')
        this.loading.set(false)
      }
    })
  }

  aplicarFiltros(): void {
    this.cargarLogs(1)
  }

  limpiarFiltros(): void {
    this.filters = { id_usu: null, accion: '', entidad: '' }
    this.cargarLogs(1)
  }

  nombreUsuario(log: AuditLog): string {
    if (!log.usuario) return 'Sistema'
    return [log.usuario.nom_usu, log.usuario.apell_usu].filter(Boolean).join(' ')
  }

  detalleTexto(detalle: unknown): string {
    if (!detalle) return 'Sin detalle'
    if (typeof detalle === 'string') return detalle
    return JSON.stringify(detalle, null, 2)
  }

  onPageChange(page: number): void {
    this.cargarLogs(page)
  }

  private buildFilters(page: number): AuditLogFilters {
    return {
      page,
      limit: this.pageSize,
      id_usu: this.filters.id_usu,
      accion: this.filters.accion.trim(),
      entidad: this.filters.entidad.trim()
    }
  }
}
