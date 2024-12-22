import { Component } from '@angular/core';
import { HomeNavbarComponent } from '../../../shared/components/ui/home-navbar/home-navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HomeNavbarComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
