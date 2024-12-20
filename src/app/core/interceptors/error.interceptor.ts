import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { inject } from '@angular/core';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((err) => {
      if(err.status === 500){
        messageService.add({severity: 'error', summary: 'Error', detail: 'An unexpected error occurred. Please try again later.'});
      }
      return throwError(() => err)
    })
  )
};
