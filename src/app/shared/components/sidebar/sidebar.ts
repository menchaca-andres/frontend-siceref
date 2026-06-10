import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { AuthStore } from '../../../core/store/auth.store'

interface SidebarItem {
  label: string
  icon: string
  route: string
  permission?: string
  role?: string
  requiresRefugio?: boolean
}

interface SidebarSection {
  title: string
  items: SidebarItem[]
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  authStore = inject(AuthStore)
  @Input() collapsed = false
  @Output() collapsedChange = new EventEmitter<boolean>()

  private readonly sections: SidebarSection[] = [
    {
      title: 'Administración',
      items: [
        { label: 'Refugios', icon: 'bx-building-house', route: '/superadmin/refugios', permission: 'refugios:obtener' },
        { label: 'Usuarios', icon: 'bx-user', route: '/superadmin/usuarios', permission: 'usuarios:obtener' },
        { label: 'Pagos', icon: 'bx-money-withdraw', route: '/superadmin/pagos', permission: 'usuarios:obtener' },
        { label: 'Roles', icon: 'bx-shield-quarter', route: '/superadmin/roles', permission: 'roles:obtener' },
        { label: 'Razas', icon: 'bx-category', route: '/superadmin/razas', permission: 'razas:obtener' },
        { label: 'Especies', icon: 'bx-leaf', route: '/superadmin/especies', permission: 'especies:obtener' },
        { label: 'Tamaños', icon: 'bx-ruler', route: '/superadmin/tamanios', permission: 'tamanios:obtener' },
        { label: 'Admins Sistema', icon: 'bx-user-plus', route: '/superadmin/admins-sistema', permission: 'admins-sistema:crear' },
        { label: 'Admins Refugio', icon: 'bx-home-heart', route: '/superadmin/admins-refugio', permission: 'admins-refugio:crear' },
        { label: 'Logs', icon: 'bx-history', route: '/superadmin/logs', role: 'Administrador del sistema' }
      ]
    },
    {
      title: 'Mi Refugio',
      items: [
        { label: 'Datos del Refugio', icon: 'bx-home', route: '/refugio/mi-refugio', permission: 'refugio:obtener:propio', requiresRefugio: true },
        { label: 'Mascotas', icon: 'bx-bone', route: '/refugio/mascotas', permission: 'mascotas:obtener', requiresRefugio: true },
        { label: 'Publicaciones', icon: 'bx-news', route: '/refugio/publicaciones', permission: 'publicaciones:obtener', requiresRefugio: true },
        { label: 'Trabajadores', icon: 'bx-id-card', route: '/refugio/trabajadores', permission: 'trabajadores:obtener', requiresRefugio: true }
      ]
    },
    {
      title: 'Adoptante',
      items: [
        { label: 'Donar', icon: 'bx-qr', route: '/adoptante/donar', permission: 'perfil:obtener' }
      ]
    },
    {
      title: 'Comunicación',
      items: [
        { label: 'Conversaciones', icon: 'bx-message-dots', route: '/conversaciones', permission: 'conversaciones:obtener' }
      ]
    }
  ]

  visibleSections = computed(() =>
    this.sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => this.canShowItem(item))
      }))
      .filter((section) => section.items.length > 0)
  )

  toggleCollapsed(): void {
    this.collapsedChange.emit(!this.collapsed)
  }

  private canShowItem(item: SidebarItem): boolean {
    if (item.requiresRefugio && !this.authStore.id_ref()) return false
    if (item.permission && this.authStore.hasPermission(item.permission)) return true
    return item.role === this.authStore.nom_rol()
  }
}
