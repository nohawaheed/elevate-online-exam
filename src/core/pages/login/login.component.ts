import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { NgxAuthApiService,AuthResponse,ErrorMessage } from 'ngx-auth-api';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { Subject, takeUntil } from 'rxjs';
import { ErrorMessageComponent } from "../../../shared/components/ui/error-message/error-message.component";
import { RegisterMethodsComponent } from "../../../shared/components/ui/register-methods/register-methods.component";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule, InputTextModule, PasswordModule, ButtonComponent, ErrorMessageComponent, RegisterMethodsComponent,RouterLink,ToastModule,CheckboxModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: []
})
export class LoginComponent implements OnInit , OnDestroy{
  constructor(private router: Router , private _ngxAuthApiService: NgxAuthApiService, private messageService: MessageService, private _authService: AuthService) {}
  loginForm: FormGroup= new FormGroup({});
  destroy$: Subject<boolean> = new Subject<boolean>();
  rememberMe: boolean = false;
  loading: boolean = false;

  ngOnInit() {
      this.loginForm = new FormGroup({
          email: new FormControl<string | null>(null , [Validators.email , Validators.required]) ,
          password: new FormControl<string | null>(null , [Validators.required , Validators.pattern(/^(?=.*[A-Za-z])(?=.*[@$!%*#?&^_-]).{6,}/)])
      });
  }
  submit() {
    this.loading = true;
    this._ngxAuthApiService.login(this.loginForm.value).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: AuthResponse) =>{ 
        if (res.message === 'success') {
          this.loading = false;
          this.messageService.add({severity: 'success', summary: 'Success', detail: res.message});
          setTimeout(() => {
            this._authService.saveUserToken(this.rememberMe,res.token);
            this.router.navigate(['/home']);
          },2000);
        }
      },
      error:(err: ErrorMessage) => {
        this.loading = false;
        this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.message});
      }
    })
  }

  ngOnDestroy(): void {
      this.destroy$.next(true);
      this.destroy$.complete();
  }
}
