import { Component } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SubjectAdapted, Subject } from '../../interfaces/subject';
import { QuizCardComponent } from '../quiz-card/quiz-card.component';
import { ExamService } from '../../services/exam.service';
import { StartQuizComponent } from '../start-quiz/start-quiz.component';

@Component({
  selector: 'app-quizes',
  standalone: true,
  imports: [ScrollingModule, QuizCardComponent, StartQuizComponent],
  templateUrl: './quizes.component.html',
  styleUrl: './quizes.component.scss',
})
export class QuizesComponent {
  constructor(private _examService: ExamService) {}
  items: Subject[] = [];
  currentPage: number = 0;
  numberOfPages: number = 1;
  limit: number = 20;
  isLoading: boolean = false;
  errorMessage: string = '';
  quizSubject: string = '';

  onScrolled(index: number) {
    const buffer = this.limit / 2;
    if (
      !this.isLoading &&
      index >= this.items.length - buffer &&
      this.currentPage < this.numberOfPages
    ) {
      this.fetchSubjects();
    }
  }

  fetchSubjects() {
    this.isLoading = true;
    this._examService
      .getSubjectsWithLimit(this.currentPage + 1, this.limit)
      .subscribe({
        next: (res: SubjectAdapted) => {
          this.items = [...this.items, ...res.subjects];
          this.currentPage = res.metadata.currentPage;
          this.numberOfPages = res.metadata.numberOfPages;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage =
            err.status === 500
              ? 'An unexpected error occurred. Please try again later.'
              : err.error.message;
          this.currentPage--;
          this.isLoading = false;
        },
      });
  }

  startQuiz(quizSubject: string) {
    this.quizSubject = quizSubject;
  }
}
