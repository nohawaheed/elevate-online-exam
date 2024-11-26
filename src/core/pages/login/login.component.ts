import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { NgxAuthApiService } from 'ngx-auth-api';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { map, Observable, of } from 'rxjs';
import { ErrorMessageComponent } from "../../../shared/components/ui/error-message/error-message.component";
import { AuthResponse, ErrorMessage } from '../../interfaces/auth-response';
import { RegisterMethodsComponent } from "../../../shared/components/ui/register-methods/register-methods.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, ButtonComponent, ErrorMessageComponent, RegisterMethodsComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private router: Router , private _ngxAuthApiService: NgxAuthApiService) {}
  loginForm: FormGroup= new FormGroup({});
  errorMessages$: Observable<ValidationErrors | null> = of([]);
  errorMessage: string = '';

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
    this._ngxAuthApiService.login(this.loginForm.value).subscribe({
      next:(res: AuthResponse) =>{ 
        if (res.message === 'success') {
        this.router.navigate(['home']);
        }
      },
      error:(err: ErrorMessage) => {
        this.errorMessage = err.error.message;
      }
    })
  }
}
