import { Publicacion } from '../publicaciones/publicacion.model'
import { Usuario } from '../usuarios/usuario.model'

export interface MensajeChat {
    id_msj: number
    id_conv: number
    id_remitente: number
    contenido: string
    fecha_msj: Date | string
    leido: boolean
    remitente?: {
        id_usu: number
        nom_usu: string
        apell_usu: string
        email_usu: string
    }
}

export interface Conversacion {
    id_conv: number
    id_usu: number
    id_publi: number
    fecha_creacion: Date | string
    usuario?: Usuario
    publicacion?: Publicacion
    mensajes: MensajeChat[]
}

export interface CreateMensajeDto {
    contenido: string
}
