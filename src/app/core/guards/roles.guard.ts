import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { TokenHelper } from '../../shared/utils/token.helper'

export const rolesGuard = (...rolesPermitidos: string[]): CanActivateFn => {
    return () => {
        const router = inject(Router)
        const rol = TokenHelper.getRol()

        if (!rol) {
            router.navigate(['/auth/login'])
            return false
        }

        if (rolesPermitidos.includes(rol)) {
            return true
        }

        router.navigate(['/not-found'])
        return false
    }
}