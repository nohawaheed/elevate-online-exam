import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', 
    loadComponent: ()=> import('./core/layout/auth-layout/auth-layout.component').then(
      (c) => c.AuthLayoutComponent),
      children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        {
          path: 'login',
          loadComponent: () =>
            import('./core/pages/login/login.component').then(
              (c) => c.LoginComponent
            ),
        },
        {
          path: 'register',
          loadComponent: () =>
            import('./core/pages/register/register.component').then(
              (c) => c.RegisterComponent
            ),
        },
        {
          path: 'forgot-password',
          loadComponent: () => 
            import('./core/pages/forgot-password/forgot-password.component').then(
              (c) => c.ForgotPasswordComponent
          )
        },
      ] 
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./feature/pages/home/home.component').then(
        (c) => c.HomeComponent
      ),
  }
];
