import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { Usuario, UpdateUsuarioDto } from '../../../core/models/usuarios/usuario.model'

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

    update(id: number, data: UpdateUsuarioDto): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, data)
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/usuarios/${id}`)
    }
}