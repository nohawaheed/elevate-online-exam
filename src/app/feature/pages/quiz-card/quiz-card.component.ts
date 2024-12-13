import { Component, Input, output } from '@angular/core';
import { Subject } from '../../interfaces/subject';
import { CardModule } from 'primeng/card';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [CardModule, NgOptimizedImage],
  templateUrl: './quiz-card.component.html',
  styleUrl: './quiz-card.component.scss',
})
export class QuizCardComponent {
  @Input() quizSubject: Subject = {
    _id: '',
    name: '',
    icon: '',
    createdAt: '',
  };
  subjectClicked = output<string>();

  emitQuizSubject(subjectId: string) {
    this.subjectClicked.emit(subjectId);
  }
}
