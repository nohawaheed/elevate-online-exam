import { Observable } from 'rxjs';
import { AuthResponse, RegisterRequest } from '../interfaces/auth.interfaces';
import { LoginRequest } from './../interfaces/auth.interfaces';

export abstract class NgxAuthApi {
  abstract login(data: LoginRequest): Observable<AuthResponse | {}>;
  abstract register(data: RegisterRequest): Observable<AuthResponse | {}>;
}
