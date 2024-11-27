import { Component, OnDestroy, OnInit, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { NgxAuthApiService ,AuthResponse, ErrorMessage } from 'ngx-auth-api';
import { ErrorMessageComponent } from "../../../shared/components/ui/error-message/error-message.component";
import { map, Observable, of, Subject, takeUntil } from 'rxjs';
import { RegisterMethodsComponent } from "../../../shared/components/ui/register-methods/register-methods.component";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, PasswordModule, ButtonComponent, RouterLink, ErrorMessageComponent, RegisterMethodsComponent, ToastModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: []
})
export class RegisterComponent implements OnInit,OnDestroy{
  constructor(private router: Router , private _ngxAuthApiService: NgxAuthApiService , private messageService: MessageService){}
  registerForm: FormGroup= new FormGroup({});
  errorMessages$: Observable<ValidationErrors | null> = of([]);
  destroy$: Subject<boolean> = new Subject<boolean>();

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
        this.registerForm.get('password')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
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
    this._ngxAuthApiService.register(this.registerForm.value).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: AuthResponse) => {
        if (res.message === 'success') {
        this.messageService.add({severity: 'success', summary: 'Success', detail: res.message});
        this.router.navigate(['login']);
        }
      },
      error:(err: ErrorMessage) => {
        this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.message});
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  } 

}
