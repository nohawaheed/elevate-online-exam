import {
  Component,
  input,
  Input,
  InputSignal,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import {
  CheckQuestionsRequest,
  CheckQuestionsResponse,
} from '../../../../feature/interfaces/exams';
import { ExamService } from '../../../../feature/services/exam.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, ChartModule, ProgressSpinnerModule],
  templateUrl: './result-dialog.component.html',
  styleUrl: './result-dialog.component.scss',
})
export class ResultDialogComponent implements OnInit {
  constructor(private _examService: ExamService, private router: Router) {}

  @Input() confirmLabel: string = '';
  @Input() cancelLabel: string = '';
  @Input() closeOnEscape: boolean = false;
  @Input() closable: boolean = false;
  @Input() header: string = '';
  @Input() modal: boolean = false;
  @Input() color: string = '#4461f2';

  examResult: InputSignal<CheckQuestionsRequest> = input.required();
  showDialog = model(false);
  buttonClicked = output<string>();
  correct = signal<number>(0);
  inCorrect = signal<number>(0);
  total = signal<string>('');
  loading = signal<boolean>(false);

  data: any;
  options: any;

  ngOnInit(): void {
    this.loading.set(true);
    this.getExamResult();
  }

  getExamResult() {
    this._examService
      .checkExamQuestions(this.examResult())
      .subscribe((res: CheckQuestionsResponse) => {
        if (res.message === 'success') {
          this.loading.set(false);
          this.correct.set(res.correct);
          this.inCorrect.set(res.wrong);
          this.total.set(res.total);
          this.data = {
            datasets: [
              {
                data: [this.correct(), this.inCorrect()],
                backgroundColor: ['#02369C', '#CC1010'],
                hoverOffset: 6,
                borderRadius: 20,
                spacing: 8,
              },
            ],
          };
          this.options = {
            cutout: '85%',
          };
        }
      });
  }

  emitAction(action: string) {
    if (action === 'Show results') {
      this.router.navigate(['/quiz-history']);
    }
    this.buttonClicked.emit(action);
  }
}
