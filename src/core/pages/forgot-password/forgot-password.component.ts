import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorMessageComponent } from "../../../shared/components/ui/error-message/error-message.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, of, Subject, takeUntil, timer } from 'rxjs';
import { RegisterMethodsComponent } from "../../../shared/components/ui/register-methods/register-methods.component";
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { NgxAuthApiService, ErrorMessage, RecoverPasswordResponse } from 'ngx-auth-api';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorMessageComponent, ButtonComponent, RegisterMethodsComponent, InputTextModule ,RouterLink, ToastModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  constructor(private _ngxAuthApiService: NgxAuthApiService, private router: Router, private messageService: MessageService, private authService:AuthService){}

  forgotPasswordForm : FormGroup = new FormGroup({});
  errorMessages$: Observable<ValidationErrors | null> = of({});
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
      this.forgotPasswordForm = new FormGroup({
        email: new FormControl<string | null>(null , [Validators.email , Validators.required]),
      });

      this.errorMessages$ = this.forgotPasswordForm.statusChanges.pipe(
        map(status => {
          if (status === 'VALID') {
            return null;
          }else{
                const control  = this.forgotPasswordForm?.controls['email'];
                const errors = [];
                if(control?.dirty && control?.errors){
                      if ('email' in control.errors){ 
                        errors.push({controlName:'email' ,message: 'Please enter a valid email address'});
                    }else if ('required' in control.errors){
                        errors.push({ controlName:'email' ,message: 'Email is required'});
                    }
                  }            
                  return errors;
                }
        })
      );
  }

  submit(){
   this.authService.setEmail(this.forgotPasswordForm.value.email);
   this._ngxAuthApiService.recoverPassword(this.forgotPasswordForm.value).pipe(takeUntil(this.destroy$)).subscribe({
     next:(res: RecoverPasswordResponse) => {
        if(res.message === 'success'){
          this.messageService.add({severity: 'success', summary: 'Success', detail: res.info});
          setTimeout(() => {
            this.router.navigate(['/verify-code']);
          }, 2000);
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
