import {
  Component,
  input,
  Input,
  InputSignal,
  model,
  OnDestroy,
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
} from '../../business/interfaces/exams';
import { ExamService } from '../../business/services/exam.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-result-dialog',
  standalone: true,
  imports: [DialogModule, ButtonModule, ChartModule, ProgressSpinnerModule],
  templateUrl: './result-dialog.component.html',
  styleUrl: './result-dialog.component.scss',
})
export class ResultDialogComponent implements OnInit, OnDestroy {
  constructor(private _examService: ExamService, private router: Router) {}

  confirmLabel: InputSignal<string> = input<string>('');
  cancelLabel: InputSignal<string> = input<string>('');
  header: InputSignal<string> = input<string>('');
  modal: InputSignal<boolean> = input<boolean>(false);
  color: InputSignal<string> = input<string>('#4461f2');

  examResult: InputSignal<CheckQuestionsRequest> = input.required();
  showDialog = model(false);
  buttonClicked = output<string>();
  correct = signal<number>(0);
  inCorrect = signal<number>(0);
  total = signal<string>('');
  loading = signal<boolean>(false);
  destroy$: Subject<boolean> = new Subject<boolean>();

  data: any;
  options: any;

  ngOnInit(): void {
    this.loading.set(true);
    this.getExamResult();
  }

  getExamResult() {
    this._examService
      .checkExamQuestions(this.examResult())
      .pipe(takeUntil(this.destroy$))
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
