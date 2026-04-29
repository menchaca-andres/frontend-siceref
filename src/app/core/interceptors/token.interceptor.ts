import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, throwError } from 'rxjs'
import { NotificationService } from '../../shared/services/notification.service'
import { TokenHelper } from '../../shared/utils/token.helper'

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const token = TokenHelper.getToken()
    const notificationService = inject(NotificationService)
    const router = inject(Router)

    if (token) {
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        })
        return next(authReq).pipe(
            catchError(error => {
                if (error.status === 401) {
                    TokenHelper.removeToken()
                    router.navigate(['/auth/login'])
                    notificationService.error('Sesión expirada. Inicia sesión de nuevo.')
                } else if (error.status === 403) {
                    notificationService.error('No tienes permiso para acceder a este recurso.')
                } else if (error.status === 404) {
                    notificationService.error('El recurso solicitado no existe.')
                } else if (error.status >= 500) {
                    notificationService.error('Error del servidor. Intenta más tarde.')
                }
                return throwError(() => error)
            })
        )
    }

    return next(req).pipe(
        catchError(error => {
            if (error.status === 0) {
                notificationService.error('Error de conexión. Verifica tu internet.')
            }
            return throwError(() => error)
        })
    )
}