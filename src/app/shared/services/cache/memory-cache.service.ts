import { Injectable } from '@angular/core'
import { Observable, shareReplay } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class MemoryCacheService {
    private cache = new Map<string, Observable<unknown>>()

    remember<T>(key: string, loader: () => Observable<T>): Observable<T> {
        const cached = this.cache.get(key)
        if (cached) return cached as Observable<T>

        const request = loader().pipe(shareReplay({ bufferSize: 1, refCount: false }))
        this.cache.set(key, request)

        return request
    }

    invalidate(keyPrefix: string): void {
        Array.from(this.cache.keys())
            .filter((key) => key.startsWith(keyPrefix))
            .forEach((key) => this.cache.delete(key))
    }

    clear(): void {
        this.cache.clear()
    }
}
