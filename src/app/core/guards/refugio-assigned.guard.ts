import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { TokenHelper } from '../../shared/utils/token.helper'
import { AuthStore } from '../store/auth.store'

export const refugioAssignedGuard: CanActivateFn = () => {
    const router = inject(Router)
    const authStore = inject(AuthStore)

    if (!TokenHelper.isLoggedIn()) {
        router.navigate(['/auth/login'])
        return false
    }

    if (authStore.id_ref() ?? TokenHelper.getIdRef()) {
        return true
    }

    router.navigate(['/not-found'])
    return false
}
