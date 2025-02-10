import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = ''; // Added confirm password field
  error: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  login(event: Event) {
   event.preventDefault();
    this.router.navigate(['/signin']);
  }
  onSubmit() {
    if (!this.username || !this.email || !this.password || !this.confirmPassword) {
      this.toastr.error('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.toastr.error('Please enter a valid email address');
      return;
    }

    // Password validation (at least 6 characters)
    if (this.password.length < 6) {
      this.toastr.error('Password must be at least 6 characters long');
      return;
    }

    // Confirm password validation
    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (response: string) => {
        this.toastr.success(response || 'Registration successful!');
        setTimeout(() => {
          this.router.navigate(['/signin']);
        }, 1500);
      },
      error: (error) => {
        console.error('Registration error:', error);
        const errorMessage = error.error || 'Registration failed';
        this.toastr.error(errorMessage);
      }
    });
  }
}
