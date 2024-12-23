import { Component, OnDestroy } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  SubjectAdapted,
  ExamSubject,
} from '../../components/business/interfaces/subject';
import { QuizCardComponent } from '../../components/ui/quiz-card/quiz-card.component';
import { ExamService } from '../../components/business/services/exam.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-quizes',
  standalone: true,
  imports: [ScrollingModule, QuizCardComponent],
  templateUrl: './quizes.component.html',
  styleUrl: './quizes.component.scss',
})
export class QuizesComponent implements OnDestroy {
  constructor(private _examService: ExamService) {}
  items: ExamSubject[] = [];
  currentPage: number = 0;
  numberOfPages: number = 1;
  limit: number = 20;
  isLoading: boolean = false;
  errorMessage: string = '';
  destroy$: Subject<boolean> = new Subject<boolean>();

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
      .pipe(takeUntil(this.destroy$))
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
