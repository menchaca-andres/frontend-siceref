export interface Especie {
    id_esp: number
    nom_esp: string
}

export interface CreateEspecieDto {
    nom_esp: string
}

export interface UpdateEspecieDto {
    nom_esp?: string
}
