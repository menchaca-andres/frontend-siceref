import { Raza } from '../razas/raza.model'
import { Refugio } from '../refugios/refugio.model'

export interface Mascota {
    id_ani: number
    nom_mascot: string
    img_mascot: string
    fechanac_mascot: Date | string
    esteril_mascot: boolean
    sexo_mascot: string
    caract_mascot: string
    fechaing_mascot: Date | string
    id_raza: number
    id_ref: number
    raza?: Raza
    refugio?: Refugio
}

export interface CreateMascotaDto {
    nom_mascot: string
    img_mascot?: string | File
    fechanac_mascot: Date | string
    esteril_mascot: boolean | string
    sexo_mascot: string
    caract_mascot: string
    id_raza: number | string
    id_ref: number | string
}

export interface UpdateMascotaDto {
    nom_mascot?: string
    img_mascot?: string | File
    fechanac_mascot?: Date | string
    esteril_mascot?: boolean | string
    sexo_mascot?: string
    caract_mascot?: string
    id_raza?: number | string
    id_ref?: number | string
}
