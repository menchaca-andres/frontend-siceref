export type EstadoPagoQr = 'GENERANDO' | 'PENDIENTE' | 'PAGADO' | 'EXPIRADO' | 'CANCELADO' | 'FALLIDO' | 'ERROR'

export interface PagoQr {
    id_pago: number
    id_usu: number | null
    id_receptor: number | null
    id_ref: number | null
    provider_payment_id: string | null
    provider: string
    validation_method: string
    monto: string
    monto_a_pagar: string | null
    moneda: string
    glosa: string
    codigo: string
    qr_payload: string | null
    qr_image_base64: string | null
    estado: EstadoPagoQr
    provider_status: string | null
    provider_message: string | null
    estimated_seconds: number
    failover_count: number
    fecha_expira: string
    fecha_pagado: string | null
    fecha_creado: string
    fecha_actualizado: string
}

export interface PagoQrUsuarioResumen {
    id_usu: number
    nom_usu: string
    apell_usu: string
    email_usu: string
}

export interface PagoQrMovimiento extends PagoQr {
    usuario: PagoQrUsuarioResumen | null
    receptor: PagoQrUsuarioResumen | null
}

export interface PagoQrAdminResumen {
    total_depositado: string
    pagos_pagados: number
    pagos_pendientes: number
    pagos_expirados: number
    moneda: string
}

export interface CreatePagoQrDto {
    amount: number
    gloss: string
    expiresIn?: number
}
