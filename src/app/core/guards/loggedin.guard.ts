import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const loggedinGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const isAuthenticated = authService.getUserToken() !== null ? true : false;
  if (authService.isPlatformBrowser() && !isAuthenticated) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
