import { DatePipe } from '@angular/common'
import { Component, computed, inject, OnInit, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
    ReporteDonacionItem,
    ReporteEstadisticas,
    ReporteTab,
    ReporteTransaccionItem,
    ReporteUsuarioItem,
} from '../../../core/models/reportes/reporte.model'
import { AuthStore } from '../../../core/store/auth.store'
import { TablePaginationComponent } from '../../../shared/components/table-pagination/table-pagination'
import { ReporteService } from '../../../shared/services/reportes/reporte.service'

@Component({
    selector: 'app-reportes',
    imports: [DatePipe, FormsModule, TablePaginationComponent],
    templateUrl: './reportes.html',
    styleUrl: './reportes.scss',
})
export class ReportesComponent implements OnInit {
    private reporteService = inject(ReporteService)
    authStore = inject(AuthStore)

    activeTab = signal<ReporteTab>('resumen')
    loading = signal(false)
    error = signal<string | null>(null)
    pageSize = 10
    page = signal(1)

    estadisticas = signal<ReporteEstadisticas | null>(null)
    usuarios = signal<ReporteUsuarioItem[]>([])
    logs = signal<ReporteTransaccionItem[]>([])
    donaciones = signal<ReporteDonacionItem[]>([])
    totalItems = signal(0)

    usuarioFilters = { id_rol: null as number | null, id_ref: null as number | null }
    logFilters = { id_usu: null as number | null, accion: '', entidad: '', fecha_desde: '', fecha_hasta: '' }
    donacionFilters = { estado_pago: '' }

    esAdminSistema = computed(() => this.authStore.isAdminSistema())

    tabs = computed(() => {
        const items: { id: ReporteTab; label: string }[] = [{ id: 'resumen', label: 'Resumen' }]

        if (this.esAdminSistema()) {
            items.push(
                { id: 'usuarios', label: 'Usuarios' },
                { id: 'logs', label: 'Logs' },
                { id: 'donaciones', label: 'Donaciones' },
            )
            return items
        }

        items.push({ id: 'donaciones', label: 'Donaciones' })
        return items
    })

    ngOnInit(): void {
        this.cargarTabActivo()
    }

    cambiarTab(tab: ReporteTab): void {
        this.activeTab.set(tab)
        this.page.set(1)
        this.error.set(null)
        this.cargarTabActivo()
    }

    recargar(): void {
        this.cargarTabActivo(this.page())
    }

    aplicarFiltros(): void {
        this.page.set(1)
        this.cargarTabActivo(1)
    }

    limpiarFiltros(): void {
        this.usuarioFilters = { id_rol: null, id_ref: null }
        this.logFilters = { id_usu: null, accion: '', entidad: '', fecha_desde: '', fecha_hasta: '' }
        this.donacionFilters = { estado_pago: '' }
        this.aplicarFiltros()
    }

    onPageChange(page: number): void {
        this.page.set(page)
        this.cargarTabActivo(page)
    }

    nombreCompleto(nombre?: string | null, apellido?: string | null): string {
        return [nombre, apellido].filter(Boolean).join(' ') || 'Sin nombre'
    }

    private cargarTabActivo(page = 1): void {
        const tab = this.activeTab()

        if (tab === 'resumen') {
            this.cargarEstadisticas()
            return
        }

        if (tab === 'usuarios') {
            this.cargarUsuarios(page)
            return
        }

        if (tab === 'logs') {
            this.cargarLogs(page)
            return
        }

        this.cargarDonaciones(page)
    }

    private cargarEstadisticas(): void {
        this.loading.set(true)
        this.error.set(null)

        const request = this.esAdminSistema()
            ? this.reporteService.getEstadisticasSistema()
            : this.reporteService.getEstadisticasRefugio()

        request.subscribe({
            next: (data) => {
                this.estadisticas.set(data)
                this.loading.set(false)
            },
            error: (err) => {
                this.error.set(err.error?.message ?? 'No se pudieron cargar las estadísticas')
                this.loading.set(false)
            },
        })
    }

    private cargarUsuarios(page: number): void {
        this.loading.set(true)
        this.error.set(null)

        this.reporteService.getUsuarios({
            page,
            limit: this.pageSize,
            id_rol: this.usuarioFilters.id_rol,
            id_ref: this.usuarioFilters.id_ref,
        }).subscribe({
            next: (response) => {
                this.usuarios.set(response.items)
                this.totalItems.set(response.total)
                this.page.set(response.page)
                this.loading.set(false)
            },
            error: (err) => {
                this.error.set(err.error?.message ?? 'No se pudo cargar el reporte de usuarios')
                this.loading.set(false)
            },
        })
    }

    private cargarLogs(page: number): void {
        this.loading.set(true)
        this.error.set(null)

        this.reporteService.getTransacciones({
            page,
            limit: this.pageSize,
            id_usu: this.logFilters.id_usu,
            accion: this.logFilters.accion.trim(),
            entidad: this.logFilters.entidad.trim(),
            fecha_desde: this.logFilters.fecha_desde,
            fecha_hasta: this.logFilters.fecha_hasta,
        }).subscribe({
            next: (response) => {
                this.logs.set(response.items)
                this.totalItems.set(response.total)
                this.page.set(response.page)
                this.loading.set(false)
            },
            error: (err) => {
                this.error.set(err.error?.message ?? 'No se pudieron cargar los logs')
                this.loading.set(false)
            },
        })
    }

    private cargarDonaciones(page: number): void {
        this.loading.set(true)
        this.error.set(null)

        const filters = {
            page,
            limit: this.pageSize,
            estado_pago: this.donacionFilters.estado_pago,
        }

        const request = this.esAdminSistema()
            ? this.reporteService.getDonacionesSistema(filters)
            : this.reporteService.getDonacionesRefugio(filters)

        request.subscribe({
            next: (response) => {
                this.donaciones.set(response.items)
                this.totalItems.set(response.total)
                this.page.set(response.page)
                this.loading.set(false)
            },
            error: (err) => {
                this.error.set(err.error?.message ?? 'No se pudo cargar el reporte de donaciones')
                this.loading.set(false)
            },
        })
    }
}
