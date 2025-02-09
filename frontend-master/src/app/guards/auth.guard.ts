import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.authService.isAuthenticated) {
      return true;
    }

    // Store the attempted URL for redirection
    this.authService.setLastAccessedUrl(route.url.join('/'));
    this.router.navigate(['/signin']);
    return false;
  }
}
