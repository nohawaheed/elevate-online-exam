import { Component, input, InputSignal } from '@angular/core';
import { ExamSubject } from '../../business/interfaces/subject';
import { CardModule } from 'primeng/card';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [CardModule, NgOptimizedImage, RouterLink],
  templateUrl: './quiz-card.component.html',
  styleUrl: './quiz-card.component.scss',
})
export class QuizCardComponent {
  quizSubject: InputSignal<ExamSubject> = input<ExamSubject>({
    _id: '',
    name: '',
    icon: '',
    createdAt: '',
  });
}
