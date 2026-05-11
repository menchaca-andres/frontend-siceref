export interface Permiso {
    id_per: number
    codigo: string
    nombre: string
}

export interface CreatePermisoDto {
    codigo: string
    nombre: string
}

export interface UpdatePermisoDto {
    codigo?: string
    nombre?: string
}
