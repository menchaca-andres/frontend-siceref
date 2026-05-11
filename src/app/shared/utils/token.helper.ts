import { JwtPayload } from '../../core/models/auth/auth.model'

export class TokenHelper {

    static getToken(): string | null {
        return localStorage.getItem('token')
    }

    static setToken(token: string): void {
        localStorage.setItem('token', token)
    }

    static removeToken(): void {
        localStorage.removeItem('token')
    }

    static getPermissions(): string[] {
        const permissions = localStorage.getItem('permissions')
        if (!permissions) return []

        try {
            return JSON.parse(permissions) as string[]
        } catch {
            return []
        }
    }

    static setPermissions(permissions: string[]): void {
        localStorage.setItem('permissions', JSON.stringify(permissions))
    }

    static removePermissions(): void {
        localStorage.removeItem('permissions')
    }

    static getPayload(): JwtPayload | null {
        const token = this.getToken()
        if (!token) return null

        try {
            const base64 = token.split('.')[1]
            const decoded = atob(base64)
            return JSON.parse(decoded) as JwtPayload
        } catch {
            return null
        }
    }

    static getRol(): string | null {
        return this.getPayload()?.nom_rol ?? null
    }

    static getIdUsu(): number | null {
        return this.getPayload()?.id_usu ?? null
    }

    static getIdRol(): number | null {
        return this.getPayload()?.id_rol ?? null
    }

    static getIdRef(): number | null {
        return this.getPayload()?.id_ref ?? null
    }

    static isTokenExpired(): boolean {
        const exp = this.getPayload()?.exp
        if (!exp) return false

        return Date.now() >= exp * 1000
    }

    static isLoggedIn(): boolean {
        return !!this.getToken() && !this.isTokenExpired()
    }
}
