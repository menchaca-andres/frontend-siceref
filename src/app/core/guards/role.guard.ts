import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { TokenHelper } from '../../shared/utils/token.helper'
import { AuthStore } from '../store/auth.store'

export const roleGuard = (...rolesPermitidos: string[]): CanActivateFn => {
    return () => {
        const router = inject(Router)
        const authStore = inject(AuthStore)

        if (!TokenHelper.isLoggedIn()) {
            router.navigate(['/auth/login'])
            return false
        }

        const storedRole = TokenHelper.getRol()

        if (rolesPermitidos.includes(authStore.nom_rol() ?? '') || rolesPermitidos.includes(storedRole ?? '')) {
            return true
        }

        router.navigate(['/not-found'])
        return false
    }
}
