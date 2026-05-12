import { Mascota } from '../mascotas/mascota.model'
import { Refugio } from '../refugios/refugio.model'

export interface Publicacion {
    id_publi: number
    fechapubli: Date | string
    estad_publ: boolean
    id_ani: number
    id_ref: number
    mascota?: Mascota
    refugio?: Refugio
}

export interface CreatePublicacionDto {
    id_ani: number | string
    id_ref?: number | string
    estad_publ?: boolean | string
}

export interface UpdatePublicacionDto {
    id_ani?: number | string
    id_ref?: number | string
    estad_publ?: boolean | string
}
