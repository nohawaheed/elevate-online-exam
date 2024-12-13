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
    path: '',
    loadComponent: () =>
      import('./feature/pages/home/home.component').then(
        (c) => c.HomeComponent
      ),
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./feature/pages/quizes/quizes.component').then(
            (c) => c.QuizesComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'quiz-history',
        loadComponent: () =>
          import('./feature/pages/quiz-history/quiz-history.component').then(
            (c) => c.QuizHistoryComponent
          ),
        canActivate: [authGuard],
      },
    ],
  },
];
