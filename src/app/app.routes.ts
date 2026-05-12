import { Routes } from '@angular/router'
import { authGuard } from './core/guards/auth.guard'
import { permissionGuard } from './core/guards/permission.guard'

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./features/home/home/home').then(m => m.Home)
    },
    {
        path: '',
        loadComponent: () => import('./shared/layout/auth-layout/auth-layout').then(m => m.AuthLayoutComponent),
        children: [
            {
                path: 'auth/login',
                loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
            },
            {
                path: 'auth/register',
                loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
            }
        ]
    },
    {
        path: '',
        loadComponent: () => import('./shared/layout/main-layout/main-layout').then(m => m.MainLayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: 'superadmin',
                children: [
                    {
                        path: 'refugios',
                        canActivate: [permissionGuard('refugios:obtener')],
                        loadComponent: () => import('./features/superadmin/refugios/refugios').then(m => m.RefugiosComponent)
                    },
                    {
                        path: 'usuarios',
                        canActivate: [permissionGuard('usuarios:obtener')],
                        loadComponent: () => import('./features/superadmin/usuarios/usuarios').then(m => m.UsuariosComponent)
                    },
                    {
                        path: 'roles',
                        canActivate: [permissionGuard('roles:obtener')],
                        loadComponent: () => import('./features/superadmin/roles/roles').then(m => m.RolesComponent)
                    },
                    {
                        path: 'admins-sistema',
                        canActivate: [permissionGuard('admins-sistema:crear')],
                        loadComponent: () => import('./features/superadmin/admins-sistema/admins-sistema').then(m => m.AdminsSistemaComponent)
                    },
                    {
                        path: 'admins-refugio',
                        canActivate: [permissionGuard('admins-refugio:crear')],
                        loadComponent: () => import('./features/superadmin/admins-refugio/admins-refugio').then(m => m.AdminsRefugioComponent)
                    }
                ]
            },
            {
                path: 'refugio',
                children: [
                    {
                        path: 'mascotas',
                        canActivate: [permissionGuard('mascotas:obtener')],
                        loadComponent: () => import('./features/refugio/mascotas/mascotas').then(m => m.MascotasComponent)
                    },
                    {
                        path: 'publicaciones',
                        canActivate: [permissionGuard('publicaciones:obtener')],
                        loadComponent: () => import('./features/refugio/publicaciones/publicaciones').then(m => m.PublicacionesComponent)
                    },
                    {
                        path: 'razas',
                        canActivate: [permissionGuard('razas:obtener')],
                        loadComponent: () => import('./features/refugio/razas/razas').then(m => m.RazasComponent)
                    },
                    {
                        path: 'especies',
                        canActivate: [permissionGuard('especies:obtener')],
                        loadComponent: () => import('./features/refugio/especies/especies').then(m => m.EspeciesComponent)
                    },
                    {
                        path: 'trabajadores',
                        canActivate: [permissionGuard('trabajadores:obtener')],
                        loadComponent: () => import('./features/refugio/trabajadores/trabajadores').then(m => m.TrabajadoresComponent)
                    },
                    {
                        path: 'mi-refugio',
                        canActivate: [permissionGuard('refugio:obtener:propio')],
                        loadComponent: () => import('./features/refugio/mi-refugio/mi-refugio').then(m => m.MiRefugioComponent)
                    }
                ]
            },
            {
                path: 'adoptante',
                children: [
                    {
                        path: 'perfil',
                        canActivate: [permissionGuard('perfil:obtener')],
                        loadComponent: () => import('./features/adoptante/perfil/perfil').then(m => m.PerfilComponent)
                    }
                ]
            }
        ]
    },
    {
        path: 'not-found',
        loadComponent: () => import('./features/not-found/not-found/not-found').then(m => m.NotFound)
    },
    {
        path: '**',
        redirectTo: 'not-found'
    }
]
