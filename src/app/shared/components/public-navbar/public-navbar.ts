import { Component, HostListener, inject, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { AuthStore } from '../../../core/store/auth.store'

@Component({
  selector: 'app-public-navbar',
  imports: [RouterLink],
  templateUrl: './public-navbar.html',
  styleUrl: './public-navbar.scss'
})
export class PublicNavbarComponent {
  authStore = inject(AuthStore)
  private router = inject(Router)
  scrolled = signal(false)
  menuOpen = signal(false)

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled.set(window.scrollY > 0)
  }

  isAuthPage(): boolean {
    const path = this.currentPath()
    return path === '/auth/login' || path === '/auth/register'
  }

  isActive(path: string, fragment?: string, exact = true): boolean {
    const currentPath = this.currentPath()
    const pathMatches = exact ? currentPath === path : currentPath === path || currentPath.startsWith(`${path}/`)
    return pathMatches && this.currentFragment() === (fragment ?? '')
  }

  toggleMenu(): void {
    this.menuOpen.update((isOpen) => !isOpen)
  }

  closeMenu(): void {
    this.menuOpen.set(false)
  }

  logout(): void {
    this.closeMenu()
    this.authStore.logout()
    this.router.navigate(['/home'])
  }

  panelRoute(): string {
    if (this.authStore.hasPermission('refugios:obtener')) return '/superadmin/refugios'
    if (this.authStore.hasPermission('mascotas:obtener')) return '/refugio/mascotas'
    if (this.authStore.hasPermission('perfil:obtener')) return '/adoptante/perfil'
    return '/home'
  }

  private currentPath(): string {
    return this.router.url.split('?')[0].split('#')[0]
  }

  private currentFragment(): string {
    return this.router.url.split('#')[1]?.split('?')[0] ?? ''
  }
}
