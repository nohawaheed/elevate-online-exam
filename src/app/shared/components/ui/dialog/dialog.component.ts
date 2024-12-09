import { Component, Input, input, InputSignal, model, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  @Input() confirmLabel: string = 'Next';
  @Input() cancelLabel: string = 'Back';
  @Input() closeOnEscape: boolean = false;
  @Input() closable: boolean = false;
  @Input() header: string = '';
  @Input() body: string = '';


  showDialog = model(false);
  buttonClicked = output<string>();

  emitAction(action: string){
    this.buttonClicked.emit(action);
  }
}
