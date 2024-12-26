import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import {
  CheckQuestionsRequest,
  Exam,
  ExamAdapted,
  Question,
} from '../../components/business/interfaces/exams';
import { ExamService } from '../../components/business/services/exam.service';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogComponent } from '../../../shared/components/ui/dialog/dialog.component';
import { ExamDialogComponent } from '../../components/ui/exam-dialog/exam-dialog.component';
import { ResultDialogComponent } from '../../components/ui/result-dialog/result-dialog.component';
import { DataViewComponent } from '../../components/ui/data-view/data-view.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-start-quiz',
  standalone: true,
  imports: [
    DataViewModule,
    SkeletonModule,
    DialogComponent,
    ExamDialogComponent,
    ResultDialogComponent,
    DataViewComponent,
    ProgressSpinnerModule,
  ],
  templateUrl: './start-quiz.component.html',
  styleUrl: './start-quiz.component.scss',
})
export class StartQuizComponent implements OnInit, OnDestroy {
  constructor(
    private _examService: ExamService,
    private _messageService: MessageService
  ) {}
  //get subjectId from url
  @Input() subjectId!: string;
  exams = signal<Exam[]>([]);
  examQuestions = signal<Question[]>([]);
  showExamModal = signal<boolean>(false);
  showExamResultModal = signal<boolean>(false);
  questionNumber = signal<number>(0);
  examResult = signal<CheckQuestionsRequest>({
    answers: [],
    time: 0,
  });
  loading = signal<boolean>(false);
  time = signal<number>(0);
  currentPage: number = 1;
  limit: number = 20;
  showConfirmationDialog = signal<boolean>(false);
  destroy$: Subject<boolean> = new Subject<boolean>();
  instructions: string = `
      Lorem ipsum dolor sit amet consectetur.
      Lorem ipsum dolor sit amet consectetur.
      Lorem ipsum dolor sit amet consectetur.
      Lorem ipsum dolor sit amet consectetur.
    `;

  ngOnInit(): void {
    this.loading.set(true);
    this._examService
      .getExamsOnSubject(this.subjectId, this.currentPage, this.limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ExamAdapted) => {
          if (res.message === 'success') {
            this.loading.set(false);
            this.exams.set(res.exams);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
        },
      });
  }

  setExamQuestions(questions: Question[]) {
    this.examQuestions.set(questions);
  }
  setConfirmationDialog(action: boolean) {
    this.showConfirmationDialog.set(action);
  }

  startExam(action: string) {
    if (action === 'Start') {
      this.showConfirmationDialog.set(false);
      if (this.examQuestions().length > 0) {
        this.showExamModal.set(true);
      } else {
        this._messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No questions found',
        });
      }
    }
  }

  sendQuestion(action: string) {
    if (action === 'Next') {
      this.questionNumber.update((value) => value + 1);
    } else if (action === 'Back') {
      this.questionNumber.update((value) => value - 1);
    }
  }

  showExamResults(results: CheckQuestionsRequest) {
    this.showExamModal.set(false);
    this.showExamResultModal.set(true);
    this.examResult.set(results);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
