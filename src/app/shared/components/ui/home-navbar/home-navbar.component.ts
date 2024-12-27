import { Component, HostListener, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { MenuItem, MessageService } from 'primeng/api';
import { ErrorMessage, LogoutResponse, NgxAuthApiService } from 'ngx-auth-api';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastModule } from 'primeng/toast';
import { DialogComponent } from '../dialog/dialog.component';
import { ButtonModule } from 'primeng/button';
import { GoogleAuthService } from '../../../../core/services/google-auth.service';

@Component({
  selector: 'app-home-navbar',
  standalone: true,
  imports: [
    MenuModule,
    MenubarModule,
    ToastModule,
    DialogComponent,
    ButtonModule,
  ],
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.scss',
})
export class HomeNavbarComponent {
  constructor(
    private _ngxAuthApiService: NgxAuthApiService,
    private _authService: AuthService,
    private _messageService: MessageService,
    private router: Router,
    private googleAuthService: GoogleAuthService
  ) {}

  items: MenuItem[] | undefined;
  showDialog = signal(false);
  mobileView = signal(false);

  @HostListener('window:resize', ['$event']) onResize(event: any) {
    if (this._authService.isPlatformBrowser()) {
      this.mobileView.set(window.matchMedia('(max-width: 992px)').matches);
    }
  }

  ngOnInit() {
    this.onResize(null);
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/dashboard'],
        styleClass: 'poppins poppins-500 mb-4 md:mb-5',
      },
      {
        label: 'Quiz History',
        icon: 'pi pi-history',
        routerLink: ['/quiz-history'],
        styleClass: 'poppins poppins-500 mb-5 md:mb-6',
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
      if (this.googleAuthService.getToken() !== null) {
        this.googleAuthService.logout();
        this.router.navigate(['/login']);
      }
      if (this._authService.isPlatformBrowser()) {
        if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
          this._ngxAuthApiService.logout().subscribe({
            next: (res: LogoutResponse) => {
              if (res.message === 'success') {
                this._authService.logout();
                this.router.navigate(['/login']);
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
  }
}
