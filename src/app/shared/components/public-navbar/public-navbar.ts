import { Component, inject } from '@angular/core'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'
import { AuthStore } from '../../../core/store/auth.store'

@Component({
  selector: 'app-public-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './public-navbar.html',
  styleUrl: './public-navbar.scss'
})
export class PublicNavbarComponent {
  authStore = inject(AuthStore)
  private router = inject(Router)

  isAuthPage(): boolean {
    const path = this.router.url.split('?')[0].split('#')[0]
    return path === '/auth/login' || path === '/auth/register'
  }

  logout(): void {
    this.authStore.logout()
    this.router.navigate(['/home'])
  }

  panelRoute(): string {
    if (this.authStore.hasPermission('refugios:obtener')) return '/superadmin/refugios'
    if (this.authStore.hasPermission('mascotas:obtener')) return '/refugio/mascotas'
    if (this.authStore.hasPermission('perfil:obtener')) return '/adoptante/perfil'
    return '/home'
  }
}
