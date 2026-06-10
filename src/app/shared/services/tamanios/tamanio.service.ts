import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { environment } from '../../../../environment/environment'
import { ApiMessage } from '../../../core/models/api/api-message.model'
import { CreateTamanioDto, Tamanio, UpdateTamanioDto } from '../../../core/models/tamanios/tamanio.model'
import { MemoryCacheService } from '../cache/memory-cache.service'

@Injectable({
    providedIn: 'root'
})
export class TamanioService {
    private http = inject(HttpClient)
    private cache = inject(MemoryCacheService)
    private apiUrl = environment.apiUrl
    private cachePrefix = 'tamanios:'

    getAll(includeInactive = false): Observable<Tamanio[]> {
        return this.cache.remember(`${this.cachePrefix}all:${includeInactive}`, () => this.http.get<Tamanio[]>(`${this.apiUrl}/tamanios${includeInactive ? '?all=true' : ''}`))
    }

    getPublic(): Observable<Tamanio[]> {
        return this.cache.remember(`${this.cachePrefix}public`, () => this.http.get<Tamanio[]>(`${this.apiUrl}/tamanios/public`))
    }

    getById(id: number): Observable<Tamanio> {
        return this.http.get<Tamanio>(`${this.apiUrl}/tamanios/${id}`)
    }

    create(data: CreateTamanioDto): Observable<Tamanio> {
        return this.http.post<Tamanio>(`${this.apiUrl}/tamanios`, data).pipe(tap(() => this.cache.invalidate(this.cachePrefix)))
    }

    update(id: number, data: UpdateTamanioDto): Observable<Tamanio> {
        return this.http.put<Tamanio>(`${this.apiUrl}/tamanios/${id}`, data).pipe(tap(() => this.cache.invalidate(this.cachePrefix)))
    }

    activate(id: number): Observable<Tamanio> {
        return this.http.put<Tamanio>(`${this.apiUrl}/tamanios/${id}/activar`, {}).pipe(tap(() => this.cache.invalidate(this.cachePrefix)))
    }

    delete(id: number): Observable<ApiMessage> {
        return this.http.delete<ApiMessage>(`${this.apiUrl}/tamanios/${id}`).pipe(tap(() => this.cache.invalidate(this.cachePrefix)))
    }
}
