import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { CreatePagoQrDto, PagoQr, PagoQrAdminResumen, PagoQrMovimiento } from '../../../core/models/pagos/pago-qr.model'

@Injectable({ providedIn: 'root' })
export class PagoQrService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    create(data: CreatePagoQrDto): Observable<PagoQr> {
        return this.http.post<PagoQr>(`${this.apiUrl}/pagos/qr`, data)
    }

    getStatus(id: number): Observable<PagoQr> {
        return this.http.get<PagoQr>(`${this.apiUrl}/pagos/${id}/status`)
    }

    getAdminSummary(): Observable<PagoQrAdminResumen> {
        return this.http.get<PagoQrAdminResumen>(`${this.apiUrl}/pagos/admin/resumen`)
    }

    getAdminMovements(): Observable<PagoQrMovimiento[]> {
        return this.http.get<PagoQrMovimiento[]>(`${this.apiUrl}/pagos/admin/movimientos`)
    }
}
