import { Raza } from '../razas/raza.model'
import { Refugio } from '../refugios/refugio.model'
import { Tamanio } from '../tamanios/tamanio.model'

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
    id_tam: number
    id_ref: number
    raza?: Raza
    tamano?: Tamanio
    refugio?: Refugio
}

export interface CreateMascotaDto {
    nom_mascot: string
    img_mascot?: string
    fechanac_mascot: Date | string
    esteril_mascot: boolean | string
    sexo_mascot: string
    caract_mascot: string
    id_raza: number | string
    id_tam: number | string
    id_ref: number | string
}

export interface UpdateMascotaDto {
    nom_mascot?: string
    img_mascot?: string
    fechanac_mascot?: Date | string
    esteril_mascot?: boolean | string
    sexo_mascot?: string
    caract_mascot?: string
    id_raza?: number | string
    id_tam?: number | string
    id_ref?: number | string
}
