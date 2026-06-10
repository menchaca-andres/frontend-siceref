export type EstadoProcesoAdopcion = 'PENDIENTE' | 'EN_REVISION' | 'FINALIZADA'

export interface ReporteEstadisticas {
    usuarios_registrados: number
    usuarios_por_rol: { codigo: string; nom_rol: string; total: number }[]
    refugios_activos: number
    refugios_inactivos: number
    mascotas_registradas: number
    publicaciones_activas: number
    publicaciones_inactivas: number
    conversaciones_registradas: number
    donaciones_registradas: number
    donaciones_pagadas: number
    total_donado: string
    moneda: string
    transacciones_registradas: number
}

export interface ReporteUsuarioItem {
    id_usu: number
    nom_usu: string
    apell_usu: string
    email_usu: string
    numcel_usu: string
    fecnac_usu: string
    nom_rol: string
    codigo_rol: string
    nom_ref: string | null
    id_ref: number | null
}

export interface ReporteProcesoItem {
    id_publi: number
    fechapubli: string
    estad_publ: boolean
    estado_proceso: EstadoProcesoAdopcion
    id_ref: number
    nom_ref: string
    id_ani: number
    nom_mascot: string
    total_conversaciones: number
    mensajes_totales: number
    tiene_responsable: boolean
}

export interface ReporteTransaccionItem {
    id_log: number
    fecha_log: string
    accion: string
    entidad: string | null
    id_entidad: string | null
    id_usu: number | null
    nom_usu: string | null
    apell_usu: string | null
    email_usu: string | null
    nom_rol: string | null
    ip: string | null
}

export interface ReporteDonacionItem {
    id_pago: number
    fecha_creado: string
    fecha_pagado: string | null
    estado: string
    monto: string
    monto_a_pagar: string | null
    moneda: string
    glosa: string
    codigo: string
    nom_usu: string | null
    apell_usu: string | null
    email_usu: string | null
    nom_receptor: string | null
    nom_ref: string | null
}

export interface PaginatedReport<T> {
    items: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface ReporteFilters {
    page?: number
    limit?: number
    id_rol?: number | null
    id_ref?: number | null
    estado_proceso?: EstadoProcesoAdopcion | ''
    estado_pago?: string
    entidad?: string
    accion?: string
    id_usu?: number | null
    fecha_desde?: string
    fecha_hasta?: string
}

export type ReporteTab = 'resumen' | 'usuarios' | 'procesos' | 'transacciones' | 'donaciones'
