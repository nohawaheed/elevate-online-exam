import { Component, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { DataViewComponent } from '../../components/ui/data-view/data-view.component';
import { ExamService } from '../../components/business/services/exam.service';
import {
  Exam,
  ExamScore,
  History,
} from '../../components/business/interfaces/exams';
import { Subject, switchMap, take, takeUntil } from 'rxjs';
import { AnswersDialogComponent } from '../../components/ui/answers-dialog/answers-dialog.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-quiz-history',
  standalone: true,
  imports: [DataViewComponent, AnswersDialogComponent, ProgressSpinnerModule],
  templateUrl: './quiz-history.component.html',
  styleUrl: './quiz-history.component.scss',
})
export class QuizHistoryComponent implements OnInit, OnDestroy {
  constructor(private _examService: ExamService) {}
  history = signal<History[]>([]);
  examInfo = signal<Exam>({} as Exam);
  showAnswersModal = signal<boolean>(false);
  loading = signal<boolean>(false);
  destroy$: Subject<boolean> = new Subject<boolean>();
  examResultInfo = signal<ExamScore[] | null>(null);

  ngOnInit(): void {
    this.getExamHistory();
    this.showExamWrongAnswers();
    if (this.examResultInfo()) {
      this.showAnswersModal.set(true);
    }
  }

  showAnswers(showAnswersDialog: boolean) {
    this.showAnswersModal.set(showAnswersDialog);
  }

  showExamWrongAnswers() {
    this.examResultInfo.set(this._examService.getExamResult());
  }

  getExamHistory() {
    this.loading.set(true);
    this._examService
      .getExamHistory()
      .pipe(
        switchMap((exam) => {
          this.history.set([exam.history]);
          return this._examService.getExamById(exam.history.QID.exam);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.loading.set(false);
            this.examInfo.set(res.exam);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
