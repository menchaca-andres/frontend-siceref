import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, throwError } from 'rxjs'
import { TokenHelper } from '../../shared/utils/token.helper'
import { AuthStore } from '../store/auth.store'

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const token = TokenHelper.getToken()
    const router = inject(Router)
    const authStore = inject(AuthStore)

    const authReq = token
        ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
        : req

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401 && !isAuthRequest(req.url)) {
                authStore.logout()
                router.navigate(['/auth/login'])
            }

            return throwError(() => error)
        })
    )
}

const isAuthRequest = (url: string): boolean => url.includes('/auth/login') || url.includes('/auth/register')
