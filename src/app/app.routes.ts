import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loggedinGuard } from './core/guards/loggedin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/auth-layout/auth-layout.component').then(
        (c) => c.AuthLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./core/pages/login/login.component').then(
            (c) => c.LoginComponent
          ),
        canActivate: [loggedinGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./core/pages/register/register.component').then(
            (c) => c.RegisterComponent
          ),
        canActivate: [loggedinGuard],
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./core/pages/forgot-password/forgot-password.component').then(
            (c) => c.ForgotPasswordComponent
          ),
        canActivate: [loggedinGuard],
      },
    ],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./feature/pages/home/home.component').then(
        (c) => c.HomeComponent
      ),
    canActivate: [authGuard],
  },
];
