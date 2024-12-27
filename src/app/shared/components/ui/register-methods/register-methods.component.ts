import { Component } from '@angular/core';
import { GoogleAuthService } from './../../../../core/services/google-auth.service';

@Component({
  selector: 'app-register-methods',
  standalone: true,
  imports: [],
  templateUrl: './register-methods.component.html',
  styleUrl: './register-methods.component.scss',
})
export class RegisterMethodsComponent {
  constructor(private googleAuthService: GoogleAuthService) {}
  loginWithGoogle() {
    this.googleAuthService.login();
  }
}
