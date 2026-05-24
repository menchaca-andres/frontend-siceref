import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { Conversacion, CreateMensajeDto, MensajeChat } from '../../../core/models/conversaciones/conversacion.model'

@Injectable({
    providedIn: 'root'
})
export class ConversacionService {
    private http = inject(HttpClient)
    private apiUrl = environment.apiUrl

    getMine(): Observable<Conversacion[]> {
        return this.http.get<Conversacion[]>(`${this.apiUrl}/conversaciones`)
    }

    getById(id_conv: number): Observable<Conversacion> {
        return this.http.get<Conversacion>(`${this.apiUrl}/conversaciones/${id_conv}`)
    }

    getByPublicacion(id_publi: number): Observable<Conversacion> {
        return this.http.get<Conversacion>(`${this.apiUrl}/conversaciones/publicacion/${id_publi}`)
    }

    createMensajeByConversacion(id_conv: number, data: CreateMensajeDto): Observable<MensajeChat> {
        return this.http.post<MensajeChat>(`${this.apiUrl}/conversaciones/${id_conv}/mensajes`, data)
    }

    createMensajeByPublicacion(id_publi: number, data: CreateMensajeDto): Observable<MensajeChat> {
        return this.http.post<MensajeChat>(`${this.apiUrl}/conversaciones/publicacion/${id_publi}/mensajes`, data)
    }
}
