import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(): boolean {
    const user = this.authService.currentUserValue;
    console.log('AdminGuard checking user:', user);

    if (!user) {
      this.toastr.error('Please login first');
      this.router.navigate(['/signin']);
      return false;
    }

    if (user.role !== 'ADMIN') {
      this.toastr.error('Access denied. Admin privileges required.');
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
