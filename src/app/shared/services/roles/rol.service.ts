import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { Rol } from '../../../core/models/roles/rol.model'

@Injectable({
    providedIn: 'root'
})
export class RolService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    getAll(): Observable<Rol[]> {
        return this.http.get<Rol[]>(`${this.apiUrl}/roles`)
    }

    getById(id: number): Observable<Rol> {
        return this.http.get<Rol>(`${this.apiUrl}/roles/${id}`)
    }

    create(data: { nom_rol: string }): Observable<Rol> {
        return this.http.post<Rol>(`${this.apiUrl}/roles`, data)
    }

    update(id: number, data: { nom_rol: string }): Observable<Rol> {
        return this.http.put<Rol>(`${this.apiUrl}/roles/${id}`, data)
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/roles/${id}`)
    }
}