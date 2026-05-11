export interface Especie {
    id_esp: number
    id_ref: number
    nom_esp: string
}

export interface CreateEspecieDto {
    id_ref: number
    nom_esp: string
}

export interface UpdateEspecieDto {
    id_ref?: number
    nom_esp?: string
}
