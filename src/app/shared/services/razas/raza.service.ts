import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { Raza, CreateRazaDto, UpdateRazaDto } from '../../../core/models/razas/raza.model'

@Injectable({
    providedIn: 'root'
})
export class RazaService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    getAll(): Observable<Raza[]> {
        return this.http.get<Raza[]>(`${this.apiUrl}/razas`)
    }

    getById(id: number): Observable<Raza> {
        return this.http.get<Raza>(`${this.apiUrl}/razas/${id}`)
    }

    create(data: CreateRazaDto): Observable<Raza> {
        return this.http.post<Raza>(`${this.apiUrl}/razas`, data)
    }

    update(id: number, data: UpdateRazaDto): Observable<Raza> {
        return this.http.put<Raza>(`${this.apiUrl}/razas/${id}`, data)
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/razas/${id}`)
    }
}