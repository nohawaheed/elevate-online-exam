import { Component, input, InputSignal, model } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { History } from '../../business/interfaces/exams';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';

@Component({
  selector: 'app-answers-dialog',
  standalone: true,
  imports: [DialogModule, ButtonComponent],
  templateUrl: './answers-dialog.component.html',
  styleUrl: './answers-dialog.component.scss',
})
export class AnswersDialogComponent {
  showDialog = model(false);
  examHistory: InputSignal<History[]> = input.required();

  closeModal(clicked: boolean) {
    if (clicked) {
      this.showDialog.set(false);
    }
  }
}
