export interface Usuario {
    id_usuario: number
    id_rol: number
    id_refug: number | null
    nom_usuario: string
    apell_usuario: string
    corr_usuario: string
    telf_usuario: string
    fenac_usuario: Date
    gen_usuario: boolean
    direc_usuario: string
    nom_rol?: string
    nom_refug?: string
}

export interface UpdateUsuarioDto {
    nom_usuario?: string
    apell_usuario?: string
    corr_usuario?: string
    telf_usuario?: string
    direc_usuario?: string
}