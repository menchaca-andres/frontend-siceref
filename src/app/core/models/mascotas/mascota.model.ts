export interface Mascota {
    id_mascot: number
    id_raza: number
    img_mascot: string
    nom_mascot: string
    edad_mascot: number
    fenac_mascot: Date
    descrip_mascot: string
    gen_mascot: boolean
    esterilizado: boolean
    nom_raza?: string
    nom_espe?: string
}

export interface CreateMascotaDto {
    id_raza: number
    img_mascot: string
    nom_mascot: string
    edad_mascot: number
    fenac_mascot: Date
    descrip_mascot: string
    gen_mascot: boolean
    esterilizado: boolean
}

export interface UpdateMascotaDto {
    img_mascot?: string
    nom_mascot?: string
    edad_mascot?: number
    descrip_mascot?: string
    esterilizado?: boolean
}