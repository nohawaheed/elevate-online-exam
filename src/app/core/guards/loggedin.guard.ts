import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

export const loggedinGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const oAuthService: OAuthService = inject(OAuthService);
  const router: Router = inject(Router);
  const isAuthenticated = authService.getUserToken() !== null ? true : false;

  if (
    (authService.isPlatformBrowser() && !isAuthenticated) ||
    (authService.isPlatformBrowser() && !oAuthService.hasValidIdToken())
  ) {
    return true;
  } else {
    router.navigate(['/home']);
    return false;
  }
};
