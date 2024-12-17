import { Injectable } from '@angular/core';
import { Adapter } from '../interfaces/adapter';
import { AuthResponse, RegisterResponse } from '../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class NgxAuthApiAdapter implements Adapter {
  constructor() {}

  adapt(data: RegisterResponse) : AuthResponse {
    return {
      message: data.message,
      token: data.token,
      userEmail: data.user.email,
    };
  }
}
