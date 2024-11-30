import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( @Inject(PLATFORM_ID) private platformId: Object) {}
  isPlatformBrowser = () => isPlatformBrowser(this.platformId);
  private email: BehaviorSubject<string> = new BehaviorSubject<string>('');

  getEmail(): Observable<string> {
    return this.email.asObservable();
  }
  setEmail(email: string): void {
    this.email.next(email);
  }

  saveUserToken(rememberMe: boolean, token: string): void {
    if (this.isPlatformBrowser()) {
      if(rememberMe) {
        localStorage.setItem('token', token);
      }else{
        sessionStorage.setItem('token', token);
      }
    }
  }

  getUserToken(): string | null {
    if (this.isPlatformBrowser()) {
      if(localStorage.getItem('token')){
        return localStorage.getItem('token');
      }else{
        if(sessionStorage.getItem('token')){
          return sessionStorage.getItem('token');
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
}
