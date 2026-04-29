import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals'
import { computed } from '@angular/core'
import { TokenHelper } from '../../shared/utils/token.helper'
import { AuthResponse } from '../models/auth/auth.model'

export interface AuthState {
    id_usuario: number | null
    nom_usuario: string | null
    apell_usuario: string | null
    corr_usuario: string | null
    nom_rol: string | null
    id_refug: number | null
    isLoggedIn: boolean
}

const initialState: AuthState = {
    id_usuario: null,
    nom_usuario: null,
    apell_usuario: null,
    corr_usuario: null,
    nom_rol: null,
    id_refug: null,
    isLoggedIn: false
}

export const AuthStore = signalStore(
    { providedIn: 'root' },

    withState<AuthState>(initialState),

    withComputed((state) => ({
        isSuperadmin: computed(() => state.nom_rol() === 'Superadmin'),
        isAdminRefugio: computed(() => state.nom_rol() === 'Administrador Refugio'),
        isTrabajador: computed(() => state.nom_rol() === 'Trabajador Refugio'),
        isAdoptante: computed(() => state.nom_rol() === 'Adoptante'),
        nombreCompleto: computed(() => `${state.nom_usuario()} ${state.apell_usuario()}`)
    })),

    withMethods((store) => ({
        setUsuario(response: AuthResponse): void {
            TokenHelper.setToken(response.token)
            patchState(store, {
                id_usuario: response.usuario.id_usuario,
                nom_usuario: response.usuario.nom_usuario,
                apell_usuario: response.usuario.apell_usuario,
                corr_usuario: response.usuario.corr_usuario,
                nom_rol: response.usuario.nom_rol,
                id_refug: response.usuario.id_refug,
                isLoggedIn: true
            })
        },

        logout(): void {
            TokenHelper.removeToken()
            patchState(store, initialState)
        },

        cargarDesdeToken(): void {
            const payload = TokenHelper.getPayload()
            if (!payload) return

            patchState(store, {
                id_usuario: payload.id_usuario,
                nom_rol: payload.nom_rol,
                id_refug: payload.id_refug,
                isLoggedIn: true
            })
        }
    }))
)