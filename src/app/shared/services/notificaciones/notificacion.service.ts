import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { Notificacion, UpdateNotificacionDto } from '../../../core/models/notificaciones/notificacion.model'

@Injectable({
    providedIn: 'root'
})
export class NotificacionService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    getMine(): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${this.apiUrl}/notificaciones`)
    }

    update(id: number, data: UpdateNotificacionDto): Observable<Notificacion> {
        return this.http.put<Notificacion>(`${this.apiUrl}/notificaciones/${id}`, data)
    }

    markAsRead(id: number): Observable<Notificacion> {
        return this.http.put<Notificacion>(`${this.apiUrl}/notificaciones/${id}/leida`, {})
    }
}
