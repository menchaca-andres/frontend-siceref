import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { ApiMessage } from '../../../core/models/api/api-message.model'
import { CreateMascotaDto, Mascota, UpdateMascotaDto } from '../../../core/models/mascotas/mascota.model'

@Injectable({
    providedIn: 'root'
})
export class MascotaService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    getAll(): Observable<Mascota[]> {
        return this.http.get<Mascota[]>(`${this.apiUrl}/mascotas`)
    }

    getById(id: number): Observable<Mascota> {
        return this.http.get<Mascota>(`${this.apiUrl}/mascotas/${id}`)
    }

    create(data: CreateMascotaDto | FormData): Observable<Mascota> {
        return this.http.post<Mascota>(`${this.apiUrl}/mascotas`, data)
    }

    update(id: number, data: UpdateMascotaDto | FormData): Observable<Mascota> {
        return this.http.put<Mascota>(`${this.apiUrl}/mascotas/${id}`, data)
    }

    delete(id: number): Observable<ApiMessage> {
        return this.http.delete<ApiMessage>(`${this.apiUrl}/mascotas/${id}`)
    }
}
