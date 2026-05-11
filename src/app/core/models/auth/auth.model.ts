export interface LoginDto {
    email_usu: string
    pass_usu: string
}

export interface RegisterDto {
    nom_usu: string
    apell_usu: string
    email_usu: string
    pass_usu: string
    numcel_usu: string
    fecnac_usu: Date | string
}

export interface RegisterWorkerDto extends RegisterDto {
    id_ref: number
}

export interface AuthResponse {
    token: string
    usuario: {
        id_usu: number
        nom_usu: string
        apell_usu: string
        email_usu: string
        nom_rol: string
        id_ref: number | null
        permisos: string[]
    }
}

export interface JwtPayload {
    id_usu: number
    id_rol: number
    nom_rol: string
    id_ref: number | null
    exp?: number
}
