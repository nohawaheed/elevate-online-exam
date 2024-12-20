import {
  Component,
  Input,
  model,
  output,
  InputSignal,
  input,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {
  Question,
  AnsweredQuestions,
} from '../../../../feature/interfaces/exams';
import { AuthService } from '../../../../core/services/auth.service';
import { map, Subject, takeUntil, takeWhile, timer } from 'rxjs';
import {
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-exam-dialog',
  standalone: true,
  imports: [DialogModule, RadioButtonModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './exam-dialog.component.html',
  styleUrl: './exam-dialog.component.scss',
})
export class ExamDialogComponent implements OnInit, OnDestroy {
  @Input() confirmLabel: string = 'Next';
  @Input() cancelLabel: string = 'Back';
  @Input() header: string = '';
  allExamQuestions: InputSignal<Question[]> = input.required();
  examQuestion: InputSignal<Question> = input.required();
  questionNumber: InputSignal<number> = input.required();
  destroy$: Subject<boolean> = new Subject();
  showDialog = model(false);
  buttonClicked = output<string>();
  examDuration = signal<string | null>(null);
  finalResult = output<AnsweredQuestions[]>();

  constructor(private authService: AuthService) {}
  questionsForm!: FormGroup;
  answers = signal<AnsweredQuestions[]>([]);
  ngOnInit(): void {
    this.questionsForm = new FormGroup({
      selectedAnswer: new FormControl<string | null>(null, [
        Validators.required,
      ]),
    });

    this.setAnswers();
    this.getExamDuration();
  }

  get selectedAnswer() {
    return this.questionsForm.get('selectedAnswer')?.value;
  }

  setAnswers() {
    // Initialize answers signal with all questions,
    // so that even if user didn't finish the exam all questions will be saved
    this.allExamQuestions().map((question) => {
      this.answers().push({
        questionId: question._id,
      });
    });
  }
  saveSelectedAnswer() {
    // Save the selected answer in correct property in answers array
    this.answers()[this.questionNumber()].correct = this.selectedAnswer;
  }

  emitAction(action: string) {
    this.buttonClicked.emit(action);
    if (action === 'Next') {
      //emit exam result if next is the last question
      if (this.allExamQuestions().length - 1 === this.questionNumber() + 1) {
        this.finalResult.emit(this.answers());
      }
      //to ensure that the selectedAnswer is not null when clicking next
      this.questionsForm
        .get('selectedAnswer')
        ?.setValue(this.answers()[this.questionNumber() + 1].correct);
    } else {
      //to ensure that the selectedAnswer is not null when clicking back
      this.questionsForm
        .get('selectedAnswer')
        ?.setValue(this.answers()[this.questionNumber() - 1].correct);
    }
  }

  getExamDuration() {
    if (this.authService.isPlatformBrowser()) {
      let totalMilliseconds = this.examQuestion().exam.duration * 60 * 1000;
      timer(0, 1000)
        .pipe(
          takeWhile(() => totalMilliseconds > 0),
          takeUntil(this.destroy$),
          map(() => {
            totalMilliseconds -= 1000;
            const seconds = Math.floor((totalMilliseconds / 1000) % 60);
            const minutes = Math.floor((totalMilliseconds / (1000 * 60)) % 60);
            return `${minutes ? minutes + 'm ' : ''}${seconds}s`;
          })
        )
        .subscribe((res) => {
          this.examDuration.set(res);
          if (res === '0s') {
            this.finalResult.emit(this.answers());
          }
        });
    } else {
      return;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
