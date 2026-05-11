export interface Rol {
    id_rol: number
    codigo: string
    nom_rol: string
    descrip_rol: string
}

export interface CreateRolDto {
    codigo: string
    nom_rol: string
    descrip_rol: string
}

export interface UpdateRolDto {
    codigo?: string
    nom_rol?: string
    descrip_rol?: string
}
