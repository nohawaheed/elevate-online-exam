import { Observable } from 'rxjs';
import { AuthResponse, LogoutResponse, RecoverPasswordRequest, RecoverPasswordResponse, RegisterRequest, ResetPasswordRequest, ResetPasswordResponse, VerifyCodeRequest, VerifyCodeResponse } from '../interfaces/auth.interfaces';
import { LoginRequest } from './../interfaces/auth.interfaces';

export abstract class NgxAuthApi {
  abstract login(data: LoginRequest): Observable<AuthResponse>;
  abstract register(data: RegisterRequest): Observable<AuthResponse>;
  abstract recoverPassword(data: RecoverPasswordRequest): Observable<RecoverPasswordResponse>;
  abstract verifyCode(data: VerifyCodeRequest): Observable<VerifyCodeResponse>;
  abstract resetPassword(data: ResetPasswordRequest): Observable<ResetPasswordResponse>;
  abstract logout(): Observable<LogoutResponse>;
}
