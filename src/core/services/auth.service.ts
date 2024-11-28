import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  private email: BehaviorSubject<string> = new BehaviorSubject<string>('');

  getEmail(): Observable<string> {
    return this.email.asObservable();
  }
  setEmail(email: string): void {
    this.email.next(email);
  }
}
