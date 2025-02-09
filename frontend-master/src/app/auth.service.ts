import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface User {
  userId: number;
  username: string;
  email: string;
  role: string;
  initials: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8090/users';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isAuthenticated(): boolean {
    return !!this.currentUserValue && !!this.getToken();
  }

  register(username: string, email: string, password: string): Observable<string> {
    const registerRequest: RegisterRequest = {
      username,
      email,
      password,
      role: 'USER'
    };
    return this.http.post(`${this.apiUrl}/register`, registerRequest, { responseType: 'text' });
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      map(response => {
        if (response && response.jwt) {
          const decodedToken = this.decodeToken(response.jwt);
          const user: User = {
            userId: decodedToken.userId,
            username: decodedToken.username,
            email: decodedToken.sub,
            role: decodedToken.role,
            initials: this.getInitials(decodedToken.username)
          };

          localStorage.setItem('jwt_token', response.jwt);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);

          // Get and navigate to the last accessed URL if it exists
          const lastUrl = this.getLastAccessedUrl();
          if (lastUrl && lastUrl !== '/signin') {
            this.router.navigate([lastUrl]);
            this.clearLastAccessedUrl();
          } else {
            this.router.navigate(['/homepage']);
          }

          return user;
        }
        throw new Error('Invalid response');
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/homepage']);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  checkAuthentication(): boolean {
    return this.isAuthenticated;
  }

  setLastAccessedUrl(url: string): void {
    if (url !== '/signin' && url !== '/register') {
      localStorage.setItem('lastAccessedUrl', url);
    }
  }

  private clearLastAccessedUrl(): void {
    localStorage.removeItem('lastAccessedUrl');
  }

  getLastAccessedUrl(): string {
    return localStorage.getItem('lastAccessedUrl') || '/homepage';
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'ADMIN';
  }

  getUserRole(): string | null {
    const user = this.currentUserValue;
    return user ? user.role : null;
  }
}