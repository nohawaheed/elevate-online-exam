import { Component, OnInit, signal } from '@angular/core';
import { DataViewComponent } from '../../components/ui/data-view/data-view.component';
import { ExamService } from '../../components/business/services/exam.service';
import { Exam, History } from '../../components/business/interfaces/exams';
import { switchMap } from 'rxjs';
import { AnswersDialogComponent } from '../../components/ui/answers-dialog/answers-dialog.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-quiz-history',
  standalone: true,
  imports: [DataViewComponent, AnswersDialogComponent, ProgressSpinnerModule],
  templateUrl: './quiz-history.component.html',
  styleUrl: './quiz-history.component.scss',
})
export class QuizHistoryComponent implements OnInit {
  constructor(private _examService: ExamService) {}
  history = signal<History[]>([]);
  examInfo = signal<Exam>({} as Exam);
  showAnswersModal = signal<boolean>(false);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loading.set(true);
    this._examService
      .getExamHistory()
      .pipe(
        switchMap((exam) => {
          this.history.set([exam.history]);
          return this._examService.getExamById(exam.history.QID.exam);
        })
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

  showAnswers(showAnswersDialog: boolean) {
    this.showAnswersModal.set(showAnswersDialog);
  }
}
