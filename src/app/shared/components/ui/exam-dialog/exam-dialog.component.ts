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
import { Question, ExamResult } from '../../../../feature/interfaces/exams';
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
  finalResult = output<ExamResult[]>();

  constructor(private authService: AuthService) {}
  questionsForm!: FormGroup;
  answers = signal<ExamResult[]>([]);
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
    // Initialize answers signal with null selectedAnswer for each question
    this.allExamQuestions().map((question, index) => {
      this.answers().push({
        questionNumber: index,
        selectedAnswer: null,
        correctAnswer: question.correct,
        answers: question.answers,
      });
    });
  }
  saveSelectedAnswer() {
    this.answers()[this.questionNumber()].selectedAnswer = this.selectedAnswer;
  }

  submit() {}
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
        ?.setValue(this.answers()[this.questionNumber() + 1].selectedAnswer);
    } else {
      //to ensure that the selectedAnswer is not null when clicking back
      this.questionsForm
        .get('selectedAnswer')
        ?.setValue(this.answers()[this.questionNumber() - 1].selectedAnswer);
    }
  }

  getExamDuration() {
    if (this.authService.isPlatformBrowser()) {
      // this.examQuestion().exam.duration
      let totalMilliseconds = 1 * 60 * 1000;
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
