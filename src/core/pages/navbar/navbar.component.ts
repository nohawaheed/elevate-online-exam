import { Component, OnInit } from '@angular/core';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast'
import { MenuItem, MessageService  } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SplitButtonModule,ToastModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  providers: [MessageService]
})
export class NavbarComponent implements OnInit {
constructor(private messageService: MessageService){}

items: MenuItem[] = [];
selectedLanguage: string = 'English';
ngOnInit(): void {
  this.items = [
    { label: 'English', command: () => {this.toggleLanguage('English');} },
    { label: 'Arabic', command: () => {this.toggleLanguage('Arabic');} },

  ];
}

toggleLanguage(label:string) {
  if(this.selectedLanguage === label) return;
  this.selectedLanguage = label;
  this.messageService.add({severity:'success', summary: 'Success', detail:'Language Updated'});
}
}
