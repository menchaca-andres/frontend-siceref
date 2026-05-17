import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { ApiMessage } from '../../../core/models/api/api-message.model'
import { CreateTamanioDto, Tamanio, UpdateTamanioDto } from '../../../core/models/tamanios/tamanio.model'

@Injectable({
    providedIn: 'root'
})
export class TamanioService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    getAll(includeInactive = false): Observable<Tamanio[]> {
        return this.http.get<Tamanio[]>(`${this.apiUrl}/tamanios${includeInactive ? '?all=true' : ''}`)
    }

    getById(id: number): Observable<Tamanio> {
        return this.http.get<Tamanio>(`${this.apiUrl}/tamanios/${id}`)
    }

    create(data: CreateTamanioDto): Observable<Tamanio> {
        return this.http.post<Tamanio>(`${this.apiUrl}/tamanios`, data)
    }

    update(id: number, data: UpdateTamanioDto): Observable<Tamanio> {
        return this.http.put<Tamanio>(`${this.apiUrl}/tamanios/${id}`, data)
    }

    activate(id: number): Observable<Tamanio> {
        return this.http.put<Tamanio>(`${this.apiUrl}/tamanios/${id}/activar`, {})
    }

    delete(id: number): Observable<ApiMessage> {
        return this.http.delete<ApiMessage>(`${this.apiUrl}/tamanios/${id}`)
    }
}
