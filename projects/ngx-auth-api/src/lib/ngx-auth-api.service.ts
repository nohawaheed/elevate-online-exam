import { Injectable } from '@angular/core';
import { NgxAuthApi } from './base/ngx-auth-api';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthEndpoint } from './enums/auth-endpoint';
import { NgxAuthApiAdapter } from './adapter/ngx-auth-api.adapter';
import { RegisterRequest, RegisterResponse ,LoginRequest, AuthResponse } from './interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class NgxAuthApiService implements NgxAuthApi {
  constructor(
    private _httpClient: HttpClient,
    private _authApiAdapter: NgxAuthApiAdapter
  ) {}

  login(data: LoginRequest): Observable<AuthResponse | { message: string }> {
    return this._httpClient.post(AuthEndpoint.LOGIN, data).pipe(
      map((res) => this._authApiAdapter.adapt(res as RegisterResponse)),
      catchError((err) => of({message: err.message }))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse | { message: string }> {
    return this._httpClient.post(AuthEndpoint.REGISTER, data).pipe(
      map((res) => this._authApiAdapter.adapt(res as RegisterResponse)),
      catchError((err) => of({ message: err.message }))
    );
  }
}
