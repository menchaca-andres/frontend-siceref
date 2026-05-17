export interface Tamanio {
    id_tam: number
    nom_tam: string
    estado_tam: boolean
}

export interface CreateTamanioDto {
    nom_tam: string
    estado_tam?: boolean
}

export interface UpdateTamanioDto {
    nom_tam?: string
    estado_tam?: boolean
}
