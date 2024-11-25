import { Component, Input, input, InputSignal, OnDestroy, OnInit, Signal } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Message } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [MessagesModule,ToastModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss'
})
export class ErrorMessageComponent implements OnInit , OnDestroy {
  @Input() errors! : Observable<ValidationErrors | null>;
  messages : ValidationErrors[] | null = null;
  @Input() controlName: string = '';
  destroy$ : Subject<boolean> = new Subject<boolean>();
  


  ngOnInit(): void {
    this.errors.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.messages = value ? Object.values(value) : null;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
