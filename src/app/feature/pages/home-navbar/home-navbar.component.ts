import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { ErrorMessage, LogoutResponse, NgxAuthApiService } from 'ngx-auth-api';
import { AuthService } from '../../../core/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { DialogComponent } from '../../../shared/components/ui/dialog/dialog.component';

@Component({
  selector: 'app-home-navbar',
  standalone: true,
  imports: [MenuModule, MenubarModule, ToastModule, DialogComponent],
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.scss',
})
export class HomeNavbarComponent {
  constructor(
    private _ngxAuthApiService: NgxAuthApiService,
    private _authService: AuthService,
    private _messageService: MessageService,
    private router: Router
  ) {}

  items: MenuItem[] | undefined;
  showDialog = signal(false);

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/dashboard'],
        styleClass: 'poppins poppins-500 mb-5',
      },
      {
        label: 'Quiz History',
        icon: 'pi pi-history',
        routerLink: ['/quiz-history'],
        styleClass: 'poppins poppins-500 mb-6',
      },
      {
        label: 'Log Out',
        icon: 'pi pi-sign-out',
        styleClass: 'poppins poppins-500',
        command: () => {
          this.showDialog.set(true);
        },
      },
    ];
  }

  logout(action: string) {
    if (action === 'Cancel') {
      this.showDialog.set(false);
    } else if (action === 'Ok') {
      this.showDialog.set(false);
      this._ngxAuthApiService.logout().subscribe({
        next: (res: LogoutResponse) => {
          if (res.message === 'success') {
            this._authService.logout();
            this._messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        },
        error: (err: ErrorMessage) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });
        },
      });
    }
  }
}
