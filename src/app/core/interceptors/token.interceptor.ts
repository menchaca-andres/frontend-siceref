import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { TokenHelper } from '../../shared/utils/token.helper'

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const token = TokenHelper.getToken()

    if (token) {
        const authReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        })
        return next(authReq)
    }

    return next(req)
}