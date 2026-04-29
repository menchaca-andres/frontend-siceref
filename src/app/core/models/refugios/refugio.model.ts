export interface Refugio {
    id_refug: number
    nom_refug: string
    dir_refug: string
    telf_refug: string
    corr_refug: string
    licencia_refug: string
}

export interface CreateRefugioDto {
    nom_refug: string
    dir_refug: string
    telf_refug: string
    corr_refug: string
    contra_refug: string
    licencia_refug: string
}

export interface UpdateRefugioDto {
    nom_refug?: string
    dir_refug?: string
    telf_refug?: string
    corr_refug?: string
    licencia_refug?: string
}