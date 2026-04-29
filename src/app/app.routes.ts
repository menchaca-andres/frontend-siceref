import { Routes } from '@angular/router'
import { authGuard } from './core/guards/auth.guard'
import { rolesGuard } from './core/guards/roles.guard'

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
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
                path: 'home',
                loadComponent: () => import('./features/home/home').then(m => m.HomeComponent)
            },
            {
                path: 'superadmin',
                canActivate: [rolesGuard('Superadmin')],
                children: [
                    {
                        path: 'refugios',
                        loadComponent: () => import('./features/superadmin/refugios/refugios').then(m => m.RefugiosComponent)
                    },
                    {
                        path: 'usuarios',
                        loadComponent: () => import('./features/superadmin/usuarios/usuarios').then(m => m.UsuariosComponent)
                    },
                    {
                        path: 'roles',
                        loadComponent: () => import('./features/superadmin/roles/roles').then(m => m.RolesComponent)
                    }
                ]
            },
            {
                path: 'refugio',
                canActivate: [rolesGuard('Administrador Refugio', 'Trabajador Refugio')],
                children: [
                    {
                        path: 'mascotas',
                        loadComponent: () => import('./features/refugio/mascotas/mascotas').then(m => m.MascotasComponent)
                    },
                    {
                        path: 'razas',
                        loadComponent: () => import('./features/refugio/razas/razas').then(m => m.RazasComponent)
                    },
                    {
                        path: 'especies',
                        loadComponent: () => import('./features/refugio/especies/especies').then(m => m.EspeciesComponent)
                    }
                ]
            },
            {
                path: 'adoptante',
                canActivate: [rolesGuard('Adoptante')],
                children: [
                    {
                        path: 'perfil',
                        loadComponent: () => import('./features/adoptante/perfil/perfil').then(m => m.PerfilComponent)
                    }
                ]
            }
        ]
    },
    {
        path: 'not-found',
        loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFoundComponent)
    },
    {
        path: '**',
        redirectTo: 'not-found'
    }
]