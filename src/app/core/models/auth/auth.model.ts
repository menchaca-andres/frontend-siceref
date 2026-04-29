export interface LoginDto {
    corr_usuario: string
    contra_usuario: string
}

export interface RegisterDto {
    nom_usuario: string
    apell_usuario: string
    corr_usuario: string
    contra_usuario: string
    telf_usuario: string
    fenac_usuario: string
    gen_usuario: boolean
    direc_usuario: string
}

export interface RegisterWorkerDto extends RegisterDto {
    id_refug: number
}

export interface AuthResponse {
    token: string
    usuario: {
        id_usuario: number
        nom_usuario: string
        apell_usuario: string
        corr_usuario: string
        nom_rol: string
        id_refug: number | null
    }
}

export interface JwtPayload {
    id_usuario: number
    id_rol: number
    nom_rol: string
    id_refug: number | null
}