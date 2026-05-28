export interface Refugio {
    id_ref: number
    img_ref: string | null
    nom_ref: string
    direc_ref: string
    telef_ref: string
    email_ref: string
    estado_ref: boolean
}

export interface CreateRefugioDto {
    img_ref?: string
    nom_ref: string
    direc_ref: string
    telef_ref: string
    email_ref: string
    estado_ref?: boolean
}

export interface UpdateRefugioDto {
    img_ref?: string
    nom_ref?: string
    direc_ref?: string
    telef_ref?: string
    email_ref?: string
    estado_ref?: boolean
}
