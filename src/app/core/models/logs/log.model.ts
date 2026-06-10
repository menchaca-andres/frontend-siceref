export interface AuditLogUsuario {
    id_usu: number
    nom_usu: string
    apell_usu: string
    email_usu: string
    rol?: {
        codigo: string
        nom_rol: string
    } | null
}

export interface AuditLog {
    id_log: number
    id_usu: number | null
    usuario?: AuditLogUsuario | null
    accion: string
    entidad: string | null
    id_entidad: string | null
    detalle: unknown | null
    ip: string | null
    user_agent: string | null
    fecha_log: Date | string
}

export interface AuditLogResponse {
    items: AuditLog[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface AuditLogFilters {
    page?: number
    limit?: number
    id_usu?: number | null
    accion?: string | null
    entidad?: string | null
}
