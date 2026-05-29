import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import { environment } from '../../../../environment/environment'
import { MensajeChat } from '../../../core/models/conversaciones/conversacion.model'
import { Notificacion } from '../../../core/models/notificaciones/notificacion.model'
import { TokenHelper } from '../../utils/token.helper'

type RealtimeEvent =
    | { type: 'connected'; payload: { id_usu: number } }
    | { type: 'mensaje_chat'; payload: MensajeChat }
    | { type: 'notificacion'; payload: Notificacion }

@Injectable({
    providedIn: 'root'
})
export class RealtimeService {
    private socket: WebSocket | null = null
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null
    private shouldReconnect = true
    private mensajesSubject = new Subject<MensajeChat>()
    private notificacionesSubject = new Subject<Notificacion>()

    mensajes$: Observable<MensajeChat> = this.mensajesSubject.asObservable()
    notificaciones$: Observable<Notificacion> = this.notificacionesSubject.asObservable()

    connect(): void {
        const token = TokenHelper.getToken()
        if (!token || !TokenHelper.isLoggedIn() || this.socket?.readyState === WebSocket.OPEN || this.socket?.readyState === WebSocket.CONNECTING) return

        this.shouldReconnect = true
        this.socket = new WebSocket(`${environment.wsUrl}?token=${encodeURIComponent(token)}`)
        this.socket.onmessage = (event) => this.handleMessage(event)
        this.socket.onclose = () => this.scheduleReconnect()
        this.socket.onerror = () => this.socket?.close()
    }

    disconnect(): void {
        if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
        this.shouldReconnect = false
        this.socket?.close()
        this.socket = null
    }

    private handleMessage(event: MessageEvent): void {
        try {
            const data = JSON.parse(event.data) as RealtimeEvent
            if (data.type === 'mensaje_chat') this.mensajesSubject.next(data.payload)
            if (data.type === 'notificacion') this.notificacionesSubject.next(data.payload)
        } catch {
            return
        }
    }

    private scheduleReconnect(): void {
        this.socket = null
        if (!this.shouldReconnect || !TokenHelper.isLoggedIn() || this.reconnectTimer) return

        this.reconnectTimer = setTimeout(() => {
            this.reconnectTimer = null
            this.connect()
        }, 3000)
    }
}
