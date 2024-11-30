import { Component, OnDestroy, OnInit} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { NgxAuthApiService ,AuthResponse, ErrorMessage } from 'ngx-auth-api';
import { ErrorMessageComponent } from "../../../shared/components/ui/error-message/error-message.component";
import { Subject, takeUntil } from 'rxjs';
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
          setTimeout(() => {
            this.router.navigate(['/login']);
          },2000);
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
