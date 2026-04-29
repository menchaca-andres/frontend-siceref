import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { TokenHelper } from '../../shared/utils/token.helper'

export const authGuard: CanActivateFn = () => {
    const router = inject(Router)

    if (TokenHelper.isLoggedIn()) {
        return true
    }

    router.navigate(['/auth/login'])
    return false
}