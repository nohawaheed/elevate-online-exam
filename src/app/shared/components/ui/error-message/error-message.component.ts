import { Component, input, InputSignal } from '@angular/core';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [MessagesModule, ToastModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
})
export class ErrorMessageComponent {
  message: InputSignal<string | null> = input<string | null>(null);
}
