import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {

  const authToken = inject(AuthService).getUserToken();
  if(authToken){
    req = req.clone({
      headers : req.headers.set('token', authToken)
    })
  }

  return next(req);
};
