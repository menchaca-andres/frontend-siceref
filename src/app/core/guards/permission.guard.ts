import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthStore } from '../store/auth.store'
import { TokenHelper } from '../../shared/utils/token.helper'

export const permissionGuard = (...permisosPermitidos: string[]): CanActivateFn => {
    return () => {
        const router = inject(Router)
        const authStore = inject(AuthStore)

        if (!TokenHelper.isLoggedIn()) {
            router.navigate(['/auth/login'])
            return false
        }

        const storedPermissions = TokenHelper.getPermissions()
        const hasStoredPermission = permisosPermitidos.some((permiso) => storedPermissions.includes(permiso))

        if (authStore.hasAnyPermission(...permisosPermitidos) || hasStoredPermission) {
            return true
        }

        router.navigate(['/not-found'])
        return false
    }
}
