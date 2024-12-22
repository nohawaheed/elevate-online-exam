import { Component, Input } from '@angular/core';
import { Subject } from '../../business/interfaces/subject';
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
  @Input() quizSubject: Subject = {
    _id: '',
    name: '',
    icon: '',
    createdAt: '',
  };
}
