import { Component, Input, OnInit, signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { Exam, ExamAdapted, Question } from '../../interfaces/exams';
import { ExamService } from './../../services/exam.service';
import { MessageService } from 'primeng/api';
import { ButtonComponent } from '../../../shared/components/ui/button/button.component';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogComponent } from '../../../shared/components/ui/dialog/dialog.component';

@Component({
  selector: 'app-start-quiz',
  standalone: true,
  imports: [DataViewModule, ButtonComponent, SkeletonModule, DialogComponent],
  templateUrl: './start-quiz.component.html',
  styleUrl: './start-quiz.component.scss',
})
export class StartQuizComponent implements OnInit {
  constructor(
    private _examService: ExamService,
    private _messageService: MessageService
  ) {}
  exams = signal<Exam[]>([]);
  examQuestions = signal<Question[]>([]);
  @Input({ required: true }) subjectId: string = '';
  currentPage: number = 1;
  limit: number = 20;
  showConfirmationDialog = signal<boolean>(false);
  instructions: string = `
      Lorem ipsum dolor sit amet consectetur.
      Lorem ipsum dolor sit amet consectetur.
      Lorem ipsum dolor sit amet consectetur.
      Lorem ipsum dolor sit amet consectetur.
    `;

  ngOnInit(): void {
    this._examService
      .getExamsOnSubject(this.subjectId, this.currentPage, this.limit)
      .subscribe({
        next: (res: ExamAdapted) => {
          if (res.message === 'success') {
            this.exams.set(res.exams);
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

  getExamQuestions(examRequested: boolean, examId: string) {
    if (examRequested) {
      this._examService.getQuestionsOnExam(examId).subscribe({
        next: (res) => {
          if (res.message === 'success') {
            this.examQuestions.set(res.questions);
            this.showConfirmationDialog.set(true);
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

  startExam(action: string) {}
}
