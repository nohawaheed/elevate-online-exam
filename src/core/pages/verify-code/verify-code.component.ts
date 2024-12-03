import { Component, input, InputSignal, OnDestroy, OnInit, output, OutputEmitterRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule,Validators } from '@angular/forms';
import { ButtonComponent } from "../../../shared/components/ui/button/button.component";
import { RegisterMethodsComponent } from "../../../shared/components/ui/register-methods/register-methods.component";
import { ErrorMessageComponent } from "../../../shared/components/ui/error-message/error-message.component";
import { Subject, Subscription, switchMap, take, takeUntil, timer } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessage, NgxAuthApiService, RecoverPasswordResponse, VerifyCodeResponse } from 'ngx-auth-api';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-code',
  standalone: true,
  imports: [ReactiveFormsModule,InputTextModule , ButtonComponent, RegisterMethodsComponent, ErrorMessageComponent, ToastModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent implements OnInit, OnDestroy {
  constructor(private _ngxAuthApiService: NgxAuthApiService, private messageService:MessageService, private router: Router, private authService: AuthService){}

  verifyForm: FormGroup = new FormGroup({});
  destroy$: Subject<boolean> = new Subject<boolean>();
  resendLoading: boolean = false
  verifyLoading: boolean = false
  count: number = 60;
  nextStep: OutputEmitterRef<number> = output<number>();
  email: InputSignal<string> = input.required<string>();


  ngOnInit(): void {
    this.verifyForm = new FormGroup({
      resetCode : new FormControl<string | null>(null , [Validators.required, Validators.pattern(/^[0-9]{6}$/)]),
    });
    if(this.authService.isPlatformBrowser()){
      timer(0, 1000).pipe(
        takeUntil(this.destroy$),
        take(60)
    ).subscribe(() =>  {
      this.count--;
    });
    }else{
      return;
    }
  }
  submit(){
    this.verifyLoading = true;
    this._ngxAuthApiService.verifyCode(this.verifyForm.value).subscribe({
      next:(res: VerifyCodeResponse) => {
        if(res.status === 'Success'){
          this.verifyLoading = false;
          this.messageService.add({severity: 'success', summary: 'Success', detail: res.status});
          setTimeout(() => {
          this.nextStep.emit(3);
          },2000)
        } 
      },
      error:(err: ErrorMessage) => {
        this.verifyLoading = false;
        this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.message});
      }
    });
  }

  resendCode(){
    this.resendLoading = true;
   this._ngxAuthApiService.recoverPassword({"email": this.email()}).pipe(
    takeUntil(this.destroy$)  
    ).subscribe({
      next:(res: RecoverPasswordResponse) => {
       if(res.message === 'success'){
          this.resendLoading = false;
          this.messageService.add({severity: 'success', summary: 'Success', detail: res.info});
         }
       },
       error:(err: ErrorMessage) => {
        this.resendLoading = false;
        this.messageService.add({severity: 'error', summary: 'Error', detail: err.error.message});
       }
    });
  }

  ngOnDestroy(): void {
      this.destroy$.next(true);
      this.destroy$.complete();
  }
}
