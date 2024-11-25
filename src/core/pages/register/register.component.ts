import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { NgxAuthApiService } from 'ngx-auth-api';
import { ErrorMessageComponent } from "../../../shared/components/ui/error-message/error-message.component";
import {  map, Observable, of, Subscription } from 'rxjs';
import { AuthResponse } from './../../interfaces/auth-response';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, ButtonComponent, RouterLink, ErrorMessageComponent],
templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit,OnDestroy{
  constructor(private router: Router , private _ngxAuthApiService: NgxAuthApiService){}
  registerForm: FormGroup= new FormGroup({});
  errorMessages$: Observable<ValidationErrors | null> = of([]);
  updatePasswordValidation$: Subscription | undefined = new Subscription();
  errorMessage: string = '';

  ngOnInit() {
      this.registerForm = new FormGroup({
          username: new FormControl<string | null>(null , [Validators.required,Validators.minLength(4),Validators.maxLength(25)]) ,
          firstName: new FormControl<string | null>(null , [Validators.required,Validators.minLength(4),Validators.maxLength(20)]) ,
          lastName: new FormControl<string | null>(null , [Validators.required,Validators.minLength(4),Validators.maxLength(20)]) ,
          email: new FormControl<string | null>(null , [Validators.email , Validators.required]) ,
          password: new FormControl<string | null>(null , [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*[@$!%*#?&^_-]).{6,}/)]),
          confirmPassword: new FormControl<string | null>(null , [Validators.required ,this.passwordMatchValidator]),
          phone: new FormControl<string | null>(null , [Validators.required , Validators.pattern("^01[0,1,2,5][0-9]{8}$")])
        });
        this.updatePasswordValidation$ = this.registerForm.get('password')?.valueChanges.subscribe(() => {
         return this.registerForm.get('confirmPassword')?.updateValueAndValidity();
        });
        this.errorMessages$ = this.registerForm.valueChanges.pipe(
            map(() => {
              const errors: {controlName: string , message: string}[] = [];

              Object.keys(this.registerForm.controls).forEach(key => {
                const control = this.registerForm.controls[key];
                if(control?.dirty && control?.errors){
                  switch (key) {
                    case 'username':
                      if (control.errors?.['minlength']) {
                      errors.push({controlName: 'username',
                        message: 'Username must be at least 4 characters long'
                        });
                      }else if (control.errors?.['maxlength']) {
                      errors.push({controlName: 'username',message:'Username must be at most 25 characters long'});
                      }else if(control.errors?.['required']){
                      errors.push({controlName: 'username',message:'Username is required'});
                      }
                      break;
                    case 'firstName':
                      if (control.errors?.['minlength']) {
                      errors.push({controlName: 'firstName', message:'First name must be at least 4 characters long'});
                      }else if (control.errors?.['maxlength']) {
                      errors.push({controlName: 'firstName', message:'First name must be at most 20 characters long'});
                      }else if(control.errors?.['required']){
                        errors.push({controlName: 'firstName', message:'FirstName is required'});
                      }
                      break;
                    case 'lastName':
                      if (control.errors?.['minlength']) {
                      errors.push({controlName: 'lastName', message:'Last name must be at least 4 characters long'});
                      }else if (control.errors?.['maxlength']) {
                        errors.push({controlName: 'lastName', message:'Last name must be at most 20 characters long'});
                      }else if(control.errors?.['required']){
                        errors.push({controlName: 'lastName', message:'Last name is required'});
                      }
                      break;
                    case 'email':
                      if (control.errors?.['email']) {
                      errors.push({controlName: 'email', message:'Please enter a valid email address'});
                    }else if(control.errors?.['required']){
                      errors.push({controlName: 'email', message:'Email is required'});
                    }
                      break;
                    case 'phone':
                      if (control.errors?.['pattern']) {
                      errors.push({controlName: 'phone', message:'Please enter a valid phone number'});
                    }else if (control.errors?.['required']) {
                      errors.push({controlName: 'phone', message: 'Phone number is required'});
                    }
                      break;
                    case 'password':
                      if (control.errors?.['pattern']) {
                        errors.push({controlName: 'password', message:'Password must be at least 6 characters long and contain at least one letter and one special character'});
                      }else if(control.errors?.['required']){
                        errors.push({controlName: 'password', message:'Password is required'});
                      }
                      break;
                    case 'confirmPassword':
                      if (control.errors?.['passwordMismatch']) {
                        errors.push({controlName: 'confirmPassword', message:'Passwords do not match'});
                      }else if(control.errors?.['required']){
                        errors.push({controlName: 'confirmPassword', message:'Confirm password is required'});
                      }
                      break;
                    }
                }
              });
              return errors;
          }),
        );
  }
  private passwordMatchValidator : ValidatorFn = (control: AbstractControl) : ValidationErrors | null => {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : {passwordMismatch: {message: 'Passwords do not match'}};
  }
  submit() {
    this._ngxAuthApiService.register(this.registerForm.value).subscribe({
      next:(res: AuthResponse | { message: string } ) => {
        // console.log(res);
        if (res.message === 'success') {
        this.router.navigate(['login']);
        }
      },
      error:(err) => {
        // console.log(err);
        this.errorMessage = err.message;
      }
    });
  }

  ngOnDestroy(): void {
    this.updatePasswordValidation$?.unsubscribe();
  } 

}
