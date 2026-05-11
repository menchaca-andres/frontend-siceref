import { Refugio } from '../refugios/refugio.model'
import { Rol } from '../roles/rol.model'

export interface Usuario {
    id_usu: number
    nom_usu: string
    apell_usu: string
    fecnac_usu: Date | string
    numcel_usu: string
    email_usu: string
    id_rol: number
    id_ref: number | null
    rol?: Rol
    refugio?: Refugio | null
}

export interface CreateUsuarioDto {
    nom_usu: string
    apell_usu: string
    fecnac_usu: Date | string
    numcel_usu: string
    email_usu: string
    pass_usu: string
    id_rol: number
    id_ref?: number | null
}

export interface UpdateUsuarioDto {
    nom_usu?: string
    apell_usu?: string
    fecnac_usu?: Date | string
    numcel_usu?: string
    email_usu?: string
    pass_usu?: string
    id_rol?: number
    id_ref?: number | null
}
