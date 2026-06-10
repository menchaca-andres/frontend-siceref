import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { environment } from '../../../../environment/environment'
import {
    PaginatedReport,
    ReporteDonacionItem,
    ReporteEstadisticas,
    ReporteFilters,
    ReporteProcesoItem,
    ReporteTransaccionItem,
    ReporteUsuarioItem,
} from '../../../core/models/reportes/reporte.model'

@Injectable({
    providedIn: 'root'
})
export class ReporteService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    getEstadisticasSistema() {
        return this.http.get<ReporteEstadisticas>(`${this.apiUrl}/reportes/estadisticas`)
    }

    getEstadisticasRefugio() {
        return this.http.get<ReporteEstadisticas>(`${this.apiUrl}/reportes/estadisticas/refugio`)
    }

    getUsuarios(filters: ReporteFilters = {}) {
        return this.http.get<PaginatedReport<ReporteUsuarioItem>>(`${this.apiUrl}/reportes/usuarios`, { params: this.buildParams(filters) })
    }

    getProcesosSistema(filters: ReporteFilters = {}) {
        return this.http.get<PaginatedReport<ReporteProcesoItem>>(`${this.apiUrl}/reportes/procesos`, { params: this.buildParams(filters) })
    }

    getProcesosRefugio(filters: ReporteFilters = {}) {
        return this.http.get<PaginatedReport<ReporteProcesoItem>>(`${this.apiUrl}/reportes/procesos/refugio`, { params: this.buildParams(filters) })
    }

    getTransacciones(filters: ReporteFilters = {}) {
        return this.http.get<PaginatedReport<ReporteTransaccionItem>>(`${this.apiUrl}/reportes/transacciones`, { params: this.buildParams(filters) })
    }

    getDonacionesSistema(filters: ReporteFilters = {}) {
        return this.http.get<PaginatedReport<ReporteDonacionItem>>(`${this.apiUrl}/reportes/donaciones`, { params: this.buildParams(filters) })
    }

    getDonacionesRefugio(filters: ReporteFilters = {}) {
        return this.http.get<PaginatedReport<ReporteDonacionItem>>(`${this.apiUrl}/reportes/donaciones/refugio`, { params: this.buildParams(filters) })
    }

    private buildParams(filters: ReporteFilters): HttpParams {
        let params = new HttpParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') return
            params = params.set(key, String(value))
        })

        return params
    }
}
