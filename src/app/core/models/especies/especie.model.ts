export interface Especie {
    id_espe: number
    nom_espe: string
}

export interface CreateEspecieDto {
    nom_espe: string
}

export interface UpdateEspecieDto {
    nom_espe?: string
}