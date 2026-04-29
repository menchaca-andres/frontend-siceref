import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { Refugio, CreateRefugioDto, UpdateRefugioDto } from '../../../core/models/refugios/refugio.model'

@Injectable({
    providedIn: 'root'
})
export class RefugioService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    getAll(): Observable<Refugio[]> {
        return this.http.get<Refugio[]>(`${this.apiUrl}/refugios`)
    }

    getById(id: number): Observable<Refugio> {
        return this.http.get<Refugio>(`${this.apiUrl}/refugios/${id}`)
    }

    create(data: CreateRefugioDto): Observable<Refugio> {
        return this.http.post<Refugio>(`${this.apiUrl}/refugios`, data)
    }

    update(id: number, data: UpdateRefugioDto): Observable<Refugio> {
        return this.http.put<Refugio>(`${this.apiUrl}/refugios/${id}`, data)
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/refugios/${id}`)
    }
}