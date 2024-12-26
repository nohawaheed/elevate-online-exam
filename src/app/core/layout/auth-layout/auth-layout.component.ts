import { Component } from '@angular/core';
import { NavbarComponent } from "../../pages/navbar/navbar.component";
import { RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet ,NgOptimizedImage],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
