import { Injectable, inject } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { ApiMessage } from '../../../core/models/api/api-message.model'
import { CreatePublicacionDto, Publicacion, UpdatePublicacionDto } from '../../../core/models/publicaciones/publicacion.model'

@Injectable({
    providedIn: 'root'
})
export class PublicacionService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    getAll(filters: { id_ref?: number | string; id_ani?: number | string } = {}): Observable<Publicacion[]> {
        let params = new HttpParams()

        if (filters.id_ref !== undefined && filters.id_ref !== '') {
            params = params.set('id_ref', String(filters.id_ref))
        }

        if (filters.id_ani !== undefined && filters.id_ani !== '') {
            params = params.set('id_ani', String(filters.id_ani))
        }

        return this.http.get<Publicacion[]>(`${this.apiUrl}/publicaciones`, { params })
    }

    getMine(): Observable<Publicacion[]> {
        return this.http.get<Publicacion[]>(`${this.apiUrl}/publicaciones/mis-publicaciones`)
    }

    getById(id: number): Observable<Publicacion> {
        return this.http.get<Publicacion>(`${this.apiUrl}/publicaciones/${id}`)
    }

    create(data: CreatePublicacionDto): Observable<Publicacion> {
        return this.http.post<Publicacion>(`${this.apiUrl}/publicaciones`, data)
    }

    update(id: number, data: UpdatePublicacionDto): Observable<Publicacion> {
        return this.http.put<Publicacion>(`${this.apiUrl}/publicaciones/${id}`, data)
    }

    delete(id: number): Observable<ApiMessage> {
        return this.http.delete<ApiMessage>(`${this.apiUrl}/publicaciones/${id}`)
    }
}
