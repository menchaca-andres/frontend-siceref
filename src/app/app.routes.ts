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
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
            }
        ]
    },
    {
        path: 'superadmin',
        canActivate: [authGuard, rolesGuard('Superadmin')],
        children: [
            {
                path: 'refugios',
                loadComponent: () => import('./features/superadmin/refugios/refugios.component').then(m => m.RefugiosComponent)
            },
            {
                path: 'usuarios',
                loadComponent: () => import('./features/superadmin/usuarios/usuarios.component').then(m => m.UsuariosComponent)
            },
            {
                path: 'roles',
                loadComponent: () => import('./features/superadmin/roles/roles.component').then(m => m.RolesComponent)
            }
        ]
    },
    {
        path: 'refugio',
        canActivate: [authGuard, rolesGuard('Administrador Refugio', 'Trabajador Refugio')],
        children: [
            {
                path: 'mascotas',
                loadComponent: () => import('./features/refugio/mascotas/mascotas.component').then(m => m.MascotasComponent)
            },
            {
                path: 'razas',
                loadComponent: () => import('./features/refugio/razas/razas.component').then(m => m.RazasComponent)
            },
            {
                path: 'especies',
                loadComponent: () => import('./features/refugio/especies/especies.component').then(m => m.EspeciesComponent)
            }
        ]
    },
    {
        path: 'adoptante',
        canActivate: [authGuard, rolesGuard('Adoptante')],
        children: [
            {
                path: 'perfil',
                loadComponent: () => import('./features/adoptante/perfil/perfil.component').then(m => m.PerfilComponent)
            }
        ]
    },
    {
        path: 'not-found',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
    },
    {
        path: '**',
        redirectTo: 'not-found'
    }
]