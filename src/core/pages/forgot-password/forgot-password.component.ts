import { Component, OnDestroy, OnInit } from '@angular/core';
import { ErrorMessageComponent } from "../../../shared/components/ui/error-message/error-message.component";
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
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
  destroy$: Subject<boolean> = new Subject<boolean>();
  loading: boolean = false;

  ngOnInit(): void {
      this.forgotPasswordForm = new FormGroup({
        email: new FormControl<string | null>(null , [Validators.email , Validators.required]),
      });
  }

  submit(){
    this.loading = true;
   this.authService.setEmail(this.forgotPasswordForm.value.email);
   this._ngxAuthApiService.recoverPassword(this.forgotPasswordForm.value).pipe(takeUntil(this.destroy$)).subscribe({
     next:(res: RecoverPasswordResponse) => {
        if(res.message === 'success'){
          this.loading = false;
          this.messageService.add({severity: 'success', summary: 'Success', detail: res.info});
          setTimeout(() => {
            this.router.navigate(['/verify-code']);
          }, 2000);
        }
      },
      error:(err: ErrorMessage) => {
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
