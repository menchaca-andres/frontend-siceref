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

    static getIdUsuario(): number | null {
        return this.getPayload()?.id_usuario ?? null
    }

    static getIdRefug(): number | null {
        return this.getPayload()?.id_refug ?? null
    }

    static isLoggedIn(): boolean {
        return !!this.getToken()
    }
}