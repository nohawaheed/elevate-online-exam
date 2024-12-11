import { CommonModule } from '@angular/common';
import { Component, input, Input, InputSignal, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() label: string = 'Add';
  @Input() type: string = 'button';
  @Input() padding: string = '1rem 0rem';
  @Input() width: string = '100%';
  @Input() background: string = '#4461f2';
  @Input() color: string = '#fff';
  @Input() loading: boolean = false;
  @Input() fontSize: string = '1rem';
  disabled: InputSignal<boolean> = input.required<boolean>();
  buttonClicked = output<boolean>();

  onButtonClicked(event: MouseEvent): void {
    this.buttonClicked.emit(true);
  }
}
