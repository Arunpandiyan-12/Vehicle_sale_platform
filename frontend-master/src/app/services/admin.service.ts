import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8083/admin';

  constructor(private http: HttpClient) {}

  // Car Management
  getPendingCars(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cars/pending`);
  }

  approveCar(carId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cars/${carId}/approve`, {});
  }

  rejectCar(carId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cars/${carId}/reject`, {});
  }

  // User Management
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/active`);
  }

  changeUserRole(userId: number, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/role?role=${role}`, {});
  }

  // Analytics
  getAdminAnalytics(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('jwt_token')}`);
    return this.http.get(`${this.apiUrl}/analytics`, { headers });
  }

  // Car Management
  deleteCar(carId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/car/${carId}`);
  }
} 