import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { ErrorMessageComponent } from "../../../shared/components/ui/error-message/error-message.component";
import { RegisterMethodsComponent } from "../../../shared/components/ui/register-methods/register-methods.component";
import { ToastModule } from 'primeng/toast';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { NgxAuthApiService, ResetPasswordResponse } from 'ngx-auth-api';
import { MessageService } from 'primeng/api';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [ReactiveFormsModule,ButtonComponent,PasswordModule, ErrorMessageComponent, RegisterMethodsComponent, ToastModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  constructor(private _ngxAuthApiService: NgxAuthApiService, private _authService: AuthService, private messageService:MessageService, private router: Router){}
  resetPasswordForm: FormGroup = new FormGroup({});
  destroy$: Subject<boolean> = new Subject<boolean>();
  loading: boolean = false;

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl<string | null>(null,[Validators.required,Validators.pattern(/^(?=.*[A-Za-z])(?=.*[@$!%*#?&^_-]).{8,}/)]),
      rePassword: new FormControl<string | null>(null,[Validators.required, this._authService.passwordMatchValidator()]),
    });

    this.resetPasswordForm.get('password')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      return this.resetPasswordForm.get('rePassword')?.updateValueAndValidity();
    })
  }
  submit(){
    this.loading = true;
    this._authService.getEmail().pipe(
      takeUntil(this.destroy$),
      switchMap(email => this._ngxAuthApiService.resetPassword({"email": email,"newPassword": this.resetPasswordForm.value.password}).pipe(
        takeUntil(this.destroy$),
      ))
    ).subscribe({
      next: (res: ResetPasswordResponse)=> {
        this.loading = false;
        this.messageService.add({severity: 'success', summary: 'Success', detail: res.message});
        this._authService.saveUserToken(false, res.token);
        setTimeout(() => {
          this.router.navigate(['/home']);
        },2000);
      },
      error: err =>{
        this.loading = false;
        this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.message});
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
