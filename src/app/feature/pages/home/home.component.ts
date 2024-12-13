import { Component } from '@angular/core';
import { HomeNavbarComponent } from '../home-navbar/home-navbar.component';
import { QuizesComponent } from '../quizes/quizes.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeNavbarComponent, QuizesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
