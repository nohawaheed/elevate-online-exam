import { Component, input, InputSignal, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ViewportScroller } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { GoogleAuthService } from '../../../../core/services/google-auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ButtonComponent, InputTextModule, AvatarModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  constructor(
    private scroller: ViewportScroller,
    private googleAuthService: GoogleAuthService
  ) {}
  searchInput = signal('');
  scrollTarget: InputSignal<string> = input.required();
  profileImage = signal('');

  ngOnInit(): void {
    this.getProfileInfo();
  }
  startQuiz(clicked: boolean) {
    if (clicked) {
      this.scroller.scrollToAnchor(this.scrollTarget());
    }
  }

  getProfileInfo() {
    const profile = this.googleAuthService.getProfile();
    if (profile) {
      this.profileImage.set(profile['picture']);
    }
  }
}
