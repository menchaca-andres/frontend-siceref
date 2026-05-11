import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals'
import { computed } from '@angular/core'
import { TokenHelper } from '../../shared/utils/token.helper'
import { AuthResponse } from '../models/auth/auth.model'

export interface AuthState {
    id_usu: number | null
    nom_usu: string | null
    apell_usu: string | null
    email_usu: string | null
    id_rol: number | null
    nom_rol: string | null
    id_ref: number | null
    permisos: string[]
    isLoggedIn: boolean
}

const initialState: AuthState = {
    id_usu: null,
    nom_usu: null,
    apell_usu: null,
    email_usu: null,
    id_rol: null,
    nom_rol: null,
    id_ref: null,
    permisos: [],
    isLoggedIn: false
}

export const AuthStore = signalStore(
    { providedIn: 'root' },

    withState<AuthState>(initialState),

    withComputed((state) => ({
        isAdminSistema: computed(() => state.nom_rol() === 'Administrador del sistema'),
        isAdminRefugio: computed(() => state.nom_rol() === 'Administrador del refugio'),
        isTrabajadorRefugio: computed(() => state.nom_rol() === 'Trabajador del refugio'),
        isAdoptante: computed(() => state.nom_rol() === 'Adoptante'),
        nombreCompleto: computed(() => [state.nom_usu(), state.apell_usu()].filter(Boolean).join(' '))
    })),

    withMethods((store) => ({
        hasPermission(permiso: string): boolean {
            return store.permisos().includes(permiso)
        },

        hasAnyPermission(...permisos: string[]): boolean {
            return permisos.some((permiso) => store.permisos().includes(permiso))
        },

        hasEveryPermission(...permisos: string[]): boolean {
            return permisos.every((permiso) => store.permisos().includes(permiso))
        },

        setUsuario(response: AuthResponse): void {
            TokenHelper.setToken(response.token)
            TokenHelper.setPermissions(response.usuario.permisos)
            patchState(store, {
                id_usu: response.usuario.id_usu,
                nom_usu: response.usuario.nom_usu,
                apell_usu: response.usuario.apell_usu,
                email_usu: response.usuario.email_usu,
                id_rol: TokenHelper.getPayload()?.id_rol ?? null,
                nom_rol: response.usuario.nom_rol,
                id_ref: response.usuario.id_ref,
                permisos: response.usuario.permisos,
                isLoggedIn: true
            })
        },

        logout(): void {
            TokenHelper.removeToken()
            TokenHelper.removePermissions()
            patchState(store, initialState)
        },

        cargarDesdeToken(): void {
            const payload = TokenHelper.getPayload()
            if (!payload) return

            patchState(store, {
                id_usu: payload.id_usu,
                id_rol: payload.id_rol,
                nom_rol: payload.nom_rol,
                id_ref: payload.id_ref,
                permisos: TokenHelper.getPermissions(),
                isLoggedIn: true
            })
        }
    }))
)
