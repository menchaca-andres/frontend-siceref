import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { Especie, CreateEspecieDto, UpdateEspecieDto } from '../../../core/models/especies/especie.model'

@Injectable({
    providedIn: 'root'
})
export class EspecieService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    getAll(): Observable<Especie[]> {
        return this.http.get<Especie[]>(`${this.apiUrl}/especies`)
    }

    getById(id: number): Observable<Especie> {
        return this.http.get<Especie>(`${this.apiUrl}/especies/${id}`)
    }

    create(data: CreateEspecieDto): Observable<Especie> {
        return this.http.post<Especie>(`${this.apiUrl}/especies`, data)
    }

    update(id: number, data: UpdateEspecieDto): Observable<Especie> {
        return this.http.put<Especie>(`${this.apiUrl}/especies/${id}`, data)
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/especies/${id}`)
    }
}