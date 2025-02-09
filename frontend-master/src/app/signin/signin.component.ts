import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  email: string = '';
  password: string = '';
  role: string = 'user';
  loading: boolean = false;
  error: string = '';
  returnUrl: string = '/';

  constructor(
    private router: Router, 
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit() {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  
  register(event: Event) {
    event.preventDefault(); // Prevent default behavior
    this.router.navigate(['/registration']);
  }
  
  login() {
    if (!this.email || !this.password) {
      this.toastr.error('Please fill in all fields', 'Error', {
        positionClass: 'toast-top-right',
        timeOut: 3000
      });
      return;
    }
  
    this.loading = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (user) => {
        if (user.role === 'ADMIN') {
          this.router.navigate(['/admindashboard']);
        } else {
          // Navigate to the return URL or homepage
          this.router.navigate([this.returnUrl]);
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(
          error.error?.message || 'Invalid credentials',
          'Error', {
            positionClass: 'toast-top-right',
            timeOut: 3000
          }
        );
      }
    });
  }
}
