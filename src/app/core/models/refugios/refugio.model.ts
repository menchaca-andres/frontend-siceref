export interface Refugio {
    id_ref: number
    nom_ref: string
    direc_ref: string
    telef_ref: string
    email_ref: string
    estado_ref: boolean
}

export interface CreateRefugioDto {
    nom_ref: string
    direc_ref: string
    telef_ref: string
    email_ref: string
    estado_ref?: boolean
}

export interface UpdateRefugioDto {
    nom_ref?: string
    direc_ref?: string
    telef_ref?: string
    email_ref?: string
    estado_ref?: boolean
}
