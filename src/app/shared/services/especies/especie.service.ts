import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { environment } from '../../../../environment/environment'
import { ApiMessage } from '../../../core/models/api/api-message.model'
import { Especie, CreateEspecieDto, UpdateEspecieDto } from '../../../core/models/especies/especie.model'
import { MemoryCacheService } from '../cache/memory-cache.service'

@Injectable({
    providedIn: 'root'
})
export class EspecieService {
    private http = inject(HttpClient)
    private cache = inject(MemoryCacheService)
    private apiUrl = environment.apiUrl
    private cachePrefix = 'especies:'

    getAll(): Observable<Especie[]> {
        return this.cache.remember(`${this.cachePrefix}all`, () => this.http.get<Especie[]>(`${this.apiUrl}/especies`))
    }

    getPublic(): Observable<Especie[]> {
        return this.cache.remember(`${this.cachePrefix}public`, () => this.http.get<Especie[]>(`${this.apiUrl}/especies/public`))
    }

    getById(id: number): Observable<Especie> {
        return this.http.get<Especie>(`${this.apiUrl}/especies/${id}`)
    }

    create(data: CreateEspecieDto): Observable<Especie> {
        return this.http.post<Especie>(`${this.apiUrl}/especies`, data).pipe(tap(() => this.cache.invalidate(this.cachePrefix)))
    }

    update(id: number, data: UpdateEspecieDto): Observable<Especie> {
        return this.http.put<Especie>(`${this.apiUrl}/especies/${id}`, data).pipe(tap(() => this.cache.invalidate(this.cachePrefix)))
    }

    delete(id: number): Observable<ApiMessage> {
        return this.http.delete<ApiMessage>(`${this.apiUrl}/especies/${id}`).pipe(tap(() => this.cache.invalidate(this.cachePrefix)))
    }
}
