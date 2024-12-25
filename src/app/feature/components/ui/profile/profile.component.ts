import { Component, input, InputSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
import { ViewportScroller } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, ButtonComponent, InputTextModule, AvatarModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(private scroller: ViewportScroller) {}
  searchInput = signal('');
  scrollTarget: InputSignal<string> = input.required();

  startQuiz(clicked: boolean) {
    if (clicked) {
      this.scroller.scrollToAnchor(this.scrollTarget());
    }
  }
}
