import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { LoginDto, RegisterDto, RegisterWorkerDto, AuthResponse, RegisterResponse } from '../../../core/models/auth/auth.model'

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    login(data: LoginDto): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data)
    }

    register(data: RegisterDto): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register`, data)
    }

    registerWorker(data: RegisterWorkerDto): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register/worker`, data)
    }

    registerSuperadmin(data: RegisterDto): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register/superadmin`, data)
    }

    registerAdminRefugio(data: RegisterWorkerDto): Observable<RegisterResponse> {
        return this.http.post<RegisterResponse>(`${this.apiUrl}/auth/register/admin-refugio`, data)
    }
}
