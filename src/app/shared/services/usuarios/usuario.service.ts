import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { ApiMessage } from '../../../core/models/api/api-message.model'
import { CreateUsuarioDto, Usuario, UpdateUsuarioDto } from '../../../core/models/usuarios/usuario.model'

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    getAll(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`)
    }

    getById(id: number): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`)
    }

    getMyWorkers(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios/trabajadores/mis-trabajadores`)
    }

    create(data: CreateUsuarioDto): Observable<Usuario> {
        return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, data)
    }

    update(id: number, data: UpdateUsuarioDto): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, data)
    }

    delete(id: number): Observable<ApiMessage> {
        return this.http.delete<ApiMessage>(`${this.apiUrl}/usuarios/${id}`)
    }
}
