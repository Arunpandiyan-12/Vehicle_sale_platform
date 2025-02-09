import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

export const AuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (authService.isAuthenticated) {
    return true;
  }

  toastr.error('Please login to continue');
  router.navigate(['/signin'], { queryParams: { returnUrl: router.url }});
  return false;
}; 