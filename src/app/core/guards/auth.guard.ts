import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const isAuthenticated = authService.getUserToken() !== null ?  true : false;
  if(authService.isPlatformBrowser() && !isAuthenticated){
      router.navigate(['/login']);
  }
  return isAuthenticated;
};
