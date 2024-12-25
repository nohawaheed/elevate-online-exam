import { Component, input, InputSignal, model, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  confirmLabel: InputSignal<string> = input<string>('');
  cancelLabel: InputSignal<string> = input<string>('');
  closeOnEscape: InputSignal<boolean> = input<boolean>(false);
  closable: InputSignal<boolean> = input<boolean>(false);
  header: InputSignal<string> = input<string>('');
  body: InputSignal<string> = input<string>('');
  modal: InputSignal<boolean> = input<boolean>(false);
  color: InputSignal<string> = input<string>('#4461f2');

  showDialog = model(false);
  buttonClicked = output<string>();

  emitAction(action: string) {
    this.buttonClicked.emit(action);
  }
}
