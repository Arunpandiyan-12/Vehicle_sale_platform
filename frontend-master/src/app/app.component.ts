import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, NavbarComponent, FooterComponent,FormsModule],
  template: `
    <app-navbar *ngIf="!isAdminRoute() && !isAuthPage()"></app-navbar>
    <div [class]="getMainContentClass()">
      <router-outlet></router-outlet>
    </div>
    <app-footer *ngIf="!isAuthPage() && !isAdminRoute()"></app-footer>
  `,
  styles: [`
    .main-content {
      margin-top: 0;
      // min-height: calc(100vh - 80px);
    }
    .main-content.admin {
      margin-top: 0;
    }
  `]
})
export class AppComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  isAuthPage(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('/signin') || currentUrl.includes('/registration');
  }

  isAdminRoute(): boolean {
    return this.router.url.includes('admindashboard') && this.authService.isAdmin();
  }

  getMainContentClass(): string {
    return this.isAdminRoute() ? 'main-content admin' : 'main-content';
  }
}
