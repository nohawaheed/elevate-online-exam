import { Injectable } from '@angular/core';
import { NgxAuthApi } from './base/ngx-auth-api';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthEndpoint } from './enums/auth-endpoint';
import { NgxAuthApiAdapter } from './adapter/ngx-auth-api.adapter';
import { RegisterRequest, RegisterResponse, LoginRequest, AuthResponse, ErrorMessage, RecoverPasswordResponse, RecoverPasswordRequest } from './interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class NgxAuthApiService implements NgxAuthApi {
  constructor(
    private _httpClient: HttpClient,
    private _authApiAdapter: NgxAuthApiAdapter
  ) {}

  login(data: LoginRequest): Observable<AuthResponse> {
    return this._httpClient.post(AuthEndpoint.LOGIN, data).pipe(
      map((res) => this._authApiAdapter.adapt(res as RegisterResponse)),
      catchError((err : ErrorMessage) => throwError(() => err))
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this._httpClient.post(AuthEndpoint.REGISTER, data).pipe(
      map((res) => this._authApiAdapter.adapt(res as RegisterResponse)),
      catchError((err: ErrorMessage) =>
        throwError(() => err))
    );
  }

  recoverPassword(data: RecoverPasswordRequest): Observable<RecoverPasswordResponse> {
    return this._httpClient.post(AuthEndpoint.FORGET_PASSWORD, data).pipe(
      map((res) => res as RecoverPasswordResponse),
      catchError((err:ErrorMessage) => throwError(()=> err))
    );
  }
}
