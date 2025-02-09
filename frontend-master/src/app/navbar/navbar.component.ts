import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: User | null = null;
  showDropdown = false;
  isLoggedIn$ = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.isLoggedIn$ = this.authService.isAuthenticated;
  }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn$ = this.authService.isAuthenticated;
    });
  }

  login() {
    this.router.navigate(['/signin']);
  }

  logout() {
    this.authService.logout();
    this.showDropdown = false;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  navigateToListings() {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/signin'], { queryParams: { returnUrl: '/sellerdashboard' }});
      return;
    }
    this.router.navigate(['/sellerdashboard']);
    this.showDropdown = false;
  }

  navigateToBookings() {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/signin'], { queryParams: { returnUrl: '/your-bookings' }});
      return;
    }
    this.router.navigate(['/your-bookings']);
    this.showDropdown = false;
  }

  sellacar() {
    if (!this.authService.isAuthenticated) {
      this.router.navigate(['/signin'], { queryParams: { returnUrl: '/sellacar' }});
      return;
    }
    this.router.navigate(['/sellacar']);
  }

  explorecars() {
    this.router.navigate(['/carslist']);
  }

  homepage() {
    this.router.navigate(['/homepage']);
  }

 
  
}
