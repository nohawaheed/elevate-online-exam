import {
  Component,
  input,
  InputSignal,
  OnDestroy,
  output,
  signal,
} from '@angular/core';
import { Exam, History, Question } from '../../business/interfaces/exams';
import { DataViewModule } from 'primeng/dataview';
import { SkeletonModule } from 'primeng/skeleton';
import { ExamService } from '../../business/services/exam.service';
import { MessageService } from 'primeng/api';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { Subject, takeUntil } from 'rxjs';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [DataViewModule, SkeletonModule, ButtonComponent, ProfileComponent],
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.scss',
})
export class DataViewComponent implements OnDestroy {
  constructor(
    private _examService: ExamService,
    private _messageService: MessageService
  ) {}
  examData: InputSignal<Exam[] | undefined> = input();
  historyData: InputSignal<History[] | undefined> = input();
  examInfo: InputSignal<Exam | undefined> = input();
  component: InputSignal<string> = input.required();
  examQuestions = output<Question[]>();
  openDialog = output<boolean>();
  historyId = output<string>();
  loading = signal<boolean>(false);
  destroy$ = new Subject<boolean>();

  getExamQuestions(examRequested: boolean, examId: string) {
    if (examRequested) {
      this.loading.set(true);
      this._examService
        .getQuestionsOnExam(examId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (res.message === 'success') {
              this.loading.set(false);
              this.examQuestions.emit(res.questions);
              this.openDialog.emit(true);
            }
          },
          error: (err) => {
            this._messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
            });
          },
        });
    }
  }

  checkAnswers(checkAnswer: boolean, historyId: string) {
    if (checkAnswer) {
      this.loading.set(true);
      this.openDialog.emit(true);
      this.historyId.emit(historyId);
      this.loading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
