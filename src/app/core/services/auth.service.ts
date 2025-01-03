import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  isPlatformBrowser = () => isPlatformBrowser(this.platformId);

  saveUserToken(rememberMe: boolean, token: string): void {
    if (this.isPlatformBrowser()) {
      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
    }
  }

  getUserToken(): string | null {
    if (this.isPlatformBrowser()) {
      if (localStorage.getItem('token')) {
        return localStorage.getItem('token');
      } else {
        if (
          sessionStorage.getItem('token') ||
          sessionStorage.getItem('id_token')
        ) {
          return (
            sessionStorage.getItem('token') ||
            sessionStorage.getItem('id_token')
          );
        }
      }
    }
    return null;
  }

  logout(): void {
    if (this.isPlatformBrowser()) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value?.password;
      const confirmPassword = control.value?.confirmPassword;
      return password !== confirmPassword ? { passwordMismatch: true } : null;
    };
  }
}
