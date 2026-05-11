import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { ApiMessage } from '../../../core/models/api/api-message.model'
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

    delete(id: number): Observable<ApiMessage> {
        return this.http.delete<ApiMessage>(`${this.apiUrl}/especies/${id}`)
    }
}
