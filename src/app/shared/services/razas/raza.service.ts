import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { environment } from '../../../../environment/environment'
import { ApiMessage } from '../../../core/models/api/api-message.model'
import { Raza, CreateRazaDto, UpdateRazaDto } from '../../../core/models/razas/raza.model'
import { MemoryCacheService } from '../cache/memory-cache.service'

@Injectable({
    providedIn: 'root'
})
export class RazaService {
    private http = inject(HttpClient)
    private cache = inject(MemoryCacheService)
    private apiUrl = environment.apiUrl
    private cachePrefix = 'razas:'

    getAll(): Observable<Raza[]> {
        return this.cache.remember(`${this.cachePrefix}all`, () => this.http.get<Raza[]>(`${this.apiUrl}/razas`))
    }

    getPublic(): Observable<Raza[]> {
        return this.cache.remember(`${this.cachePrefix}public`, () => this.http.get<Raza[]>(`${this.apiUrl}/razas/public`))
    }

    getById(id: number): Observable<Raza> {
        return this.http.get<Raza>(`${this.apiUrl}/razas/${id}`)
    }

    create(data: CreateRazaDto): Observable<Raza> {
        return this.http.post<Raza>(`${this.apiUrl}/razas`, data).pipe(tap(() => this.cache.invalidate(this.cachePrefix)))
    }

    update(id: number, data: UpdateRazaDto): Observable<Raza> {
        return this.http.put<Raza>(`${this.apiUrl}/razas/${id}`, data).pipe(tap(() => this.cache.invalidate(this.cachePrefix)))
    }

    delete(id: number): Observable<ApiMessage> {
        return this.http.delete<ApiMessage>(`${this.apiUrl}/razas/${id}`).pipe(tap(() => this.cache.invalidate(this.cachePrefix)))
    }
}
