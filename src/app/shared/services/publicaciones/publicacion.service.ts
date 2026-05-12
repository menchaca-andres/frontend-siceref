import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
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

    getAll(): Observable<Publicacion[]> {
        return this.http.get<Publicacion[]>(`${this.apiUrl}/publicaciones`)
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
