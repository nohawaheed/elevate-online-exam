import {
  Component,
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
  CheckQuestionsRequest,
  ExamScore,
} from '../../business/interfaces/exams';
import { AuthService } from '../../../../core/services/auth.service';
import { map, Subject, takeUntil, takeWhile, timer } from 'rxjs';
import {
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { StepperModule } from 'primeng/stepper';
import { ExamService } from '../../business/services/exam.service';

@Component({
  selector: 'app-exam-dialog',
  standalone: true,
  imports: [
    DialogModule,
    RadioButtonModule,
    ButtonModule,
    ReactiveFormsModule,
    StepperModule,
  ],
  templateUrl: './exam-dialog.component.html',
  styleUrl: './exam-dialog.component.scss',
})
export class ExamDialogComponent implements OnInit, OnDestroy {
  confirmLabel: InputSignal<string> = input<string>('Next');
  cancelLabel: InputSignal<string> = input<string>('Back');
  allExamQuestions: InputSignal<Question[]> = input.required();
  examQuestion: InputSignal<Question> = input.required();
  questionNumber: InputSignal<number> = input.required();
  destroy$: Subject<boolean> = new Subject();
  showDialog = model(false);
  buttonClicked = output<string>();
  examDuration = signal<string | null>(null);
  finalResult = output<CheckQuestionsRequest>();

  constructor(
    private authService: AuthService,
    private examService: ExamService
  ) {}
  questionsForm!: FormGroup;
  userAnswers = signal<AnsweredQuestions[]>([]);
  examAnswers = signal<ExamScore[]>([]);
  minutes = signal<number>(0);
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
      this.userAnswers().push({
        questionId: question._id,
      });
      // only using to to display the wrong and correct answers till check api is ready
      this.examAnswers().push({
        QID: question._id,
        Question: question.question,
        correct: question.correct,
        answers: question.answers,
      });
    });
  }
  saveSelectedAnswer() {
    // Save the selected answer in correct property in answers array
    this.userAnswers()[this.questionNumber()].correct = this.selectedAnswer;
    this.examAnswers()[this.questionNumber()].selectedAnswer =
      this.selectedAnswer;
  }

  emitAction(action: string) {
    this.buttonClicked.emit(action);
    if (action === 'Next') {
      //reset form value to null
      this.questionsForm.reset();
      //emit exam result if next is the last question
      if (this.allExamQuestions().length === this.questionNumber() + 1) {
        this.finalResult.emit({
          answers: this.userAnswers(),
          time: this.examQuestion().exam.duration - this.minutes(),
        });
        this.examService.setExamResult(this.examAnswers());
      } else {
        //to ensure that the selectedAnswer is not null when clicking next
        this.questionsForm
          .get('selectedAnswer')
          ?.setValue(this.userAnswers()[this.questionNumber() + 1].correct);
      }
    } else {
      //to ensure that the selectedAnswer is not null when clicking back
      this.questionsForm
        .get('selectedAnswer')
        ?.setValue(this.userAnswers()[this.questionNumber() - 1].correct);
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
            this.minutes.set(minutes);
            return `${minutes ? minutes + 'm ' : ''}${seconds}s`;
          })
        )
        .subscribe((res) => {
          this.examDuration.set(res);
          if (res === '0s') {
            this.finalResult.emit({
              answers: this.userAnswers(),
              time: this.examQuestion().exam.duration,
            });
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
