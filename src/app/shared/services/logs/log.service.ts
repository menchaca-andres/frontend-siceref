import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { AuditLogFilters, AuditLogResponse } from '../../../core/models/logs/log.model'

@Injectable({
    providedIn: 'root'
})
export class LogService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    getAll(filters: AuditLogFilters = {}): Observable<AuditLogResponse> {
        let params = new HttpParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params = params.set(key, String(value))
            }
        })

        return this.http.get<AuditLogResponse>(`${this.apiUrl}/logs`, { params })
    }
}
