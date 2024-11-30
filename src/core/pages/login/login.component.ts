import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { NgxAuthApiService,AuthResponse,ErrorMessage } from 'ngx-auth-api';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { map, Observable, of, Subject, takeUntil } from 'rxjs';
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
  errorMessages$: Observable<ValidationErrors | null> = of([]);
  destroy$: Subject<boolean> = new Subject<boolean>();
  rememberMe: boolean = false;

  ngOnInit() {
      this.loginForm = new FormGroup({
          email: new FormControl<string | null>(null , [Validators.email , Validators.required]) ,
          password: new FormControl<string | null>(null , [Validators.required , Validators.pattern(/^(?=.*[A-Za-z])(?=.*[@$!%*#?&^_-]).{6,}/)])
      });

      this.errorMessages$ = this.loginForm.valueChanges.pipe(
        map(() => {
          const errors: {controlName: string , message: string}[] = [];

          Object.keys(this.loginForm.controls).forEach(key => {
            const control = this.loginForm.controls[key];
            if(control?.dirty && control?.errors){
              switch (key) {
                case 'email':
                  if (control.errors?.['email']) {
                  errors.push({controlName: 'email', message:'Please enter a valid email address'});
                }else if(control.errors?.['required']){
                  errors.push({controlName: 'email', message:'Email is required'});
                }
                  break;
                case 'password':
                  if (control.errors?.['pattern']) {
                    errors.push({controlName: 'password', message:'Password must be at least 6 characters long and contain at least one letter and one special character'});
                  }else if(control.errors?.['required']){
                    errors.push({controlName: 'password', message:'Password is required'});
                  }
                  break;
                }
            }
          });
          return errors;
      }),
    );
  }
  submit() {
    this._ngxAuthApiService.login(this.loginForm.value).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: AuthResponse) =>{ 
        if (res.message === 'success') {
          this.messageService.add({severity: 'success', summary: 'Success', detail: res.message});
          setTimeout(() => {
            this._authService.saveUserToken(this.rememberMe,res.token);
            this.router.navigate(['/home']);
          },2000);
        }
      },
      error:(err: ErrorMessage) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.message});
      }
    })
  }

  ngOnDestroy(): void {
      this.destroy$.next(true);
      this.destroy$.complete();
  }
}
