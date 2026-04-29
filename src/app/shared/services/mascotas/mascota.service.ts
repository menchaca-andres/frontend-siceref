import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { Mascota, CreateMascotaDto, UpdateMascotaDto } from '../../../core/models/mascotas/mascota.model'

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

    create(data: CreateMascotaDto): Observable<Mascota> {
        return this.http.post<Mascota>(`${this.apiUrl}/mascotas`, data)
    }

    update(id: number, data: UpdateMascotaDto): Observable<Mascota> {
        return this.http.put<Mascota>(`${this.apiUrl}/mascotas/${id}`, data)
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/mascotas/${id}`)
    }
}