import { Publicacion } from '../publicaciones/publicacion.model'

export type TipoNotificacion = 'MENSAJE_CHAT'

export interface Notificacion {
    id_noti: number
    id_destinatario: number
    id_publi?: number | null
    tipo: TipoNotificacion
    titulo: string
    mensaje: string
    leida: boolean
    fecha_noti: Date | string
    fecha_leida?: Date | string | null
    publicacion?: Publicacion | null
}

export interface UpdateNotificacionDto {
    leida?: boolean | string
}
