import { Especie } from '../especies/especie.model'

export interface Raza {
    id_raza: number
    id_esp: number
    nom_raza: string
    especie?: Especie
}

export interface CreateRazaDto {
    id_esp: number
    nom_raza: string
}

export interface UpdateRazaDto {
    id_esp?: number
    nom_raza?: string
}
