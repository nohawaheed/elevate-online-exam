import { CommonModule } from '@angular/common';
import { Component, input, InputSignal, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [ButtonModule, CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  label: InputSignal<string> = input<string>('Add');
  type: InputSignal<string> = input<string>('button');
  padding: InputSignal<string> = input<string>('1rem 0rem');
  width: InputSignal<string> = input<string>('100%');
  background: InputSignal<string> = input<string>('#4461f2');
  color: InputSignal<string> = input<string>('#fff');
  loading: InputSignal<boolean> = input<boolean>(false);
  fontSize: InputSignal<string> = input<string>('1rem');
  borderRadius: InputSignal<string> = input<string>('');
  disabled: InputSignal<boolean> = input.required<boolean>();
  buttonClicked = output<boolean>();

  onButtonClicked(event: MouseEvent): void {
    this.buttonClicked.emit(true);
  }
}
