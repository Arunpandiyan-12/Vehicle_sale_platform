import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { tap, map } from 'rxjs/operators';
import { CarResponse } from '../seller-dashboard/seller-dashboard.component';
export interface Car {
  id: number;
  registrationNumber: string;
  ownerName: string;
  carMake: string;
  carModel: string;
  variant: string;
  manufactureYear: number;
  kms: number;
  bodyType: string;
  numberOfOwners: number;
  fuelType: string;
  transmissionType: string;
  vehicleLocation: string;
  vin: string;
  expectedPrice: number;
  description: string;
  imageUrls: string[];
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  userId: number;
  biddingAllowed: boolean;
  isSold: boolean;
  bookingCount: number;
}
@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl = 'http://localhost:8082/cars'; // Using cars endpoint for seller operations

  constructor(
    private http: HttpClient,
    private authService: AuthService, private toastr: ToastrService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Get seller's cars
  getSellerCars(userId: number): Observable<CarResponse[]> {
    return this.http.get<CarResponse[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getHeaders()
    });
  }
  getCarsByStatus(status: string): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}`);
  }
  getCars(): Observable<Car[]> {
      return this.http.get<Car[]>(this.apiUrl);
    }

    updateCarStatus(carId: number, status: string): Observable<Car> {
      return this.http.put<Car>(`${this.apiUrl}/${carId}/status`, { status });
    }
  // Mark car as sold
  markCarAsSold(carId: number): Observable<Car> {
    return this.http.put<Car>(
      `${this.apiUrl}/${carId}/update-sold-status`,
      { isSold: true },
      { headers: this.getHeaders() }
    );
  }

  // Get seller's bookings
  getSellerBookings(sellerId: number): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/${sellerId}/bookings`, {
      headers: this.getHeaders()
    });
  }

  // Update booking status
  updateBookingStatus(sellerId: number, bookingId: number, status: string): Observable<Car> {
    return this.http.put<Car>(
      `${this.apiUrl}/${sellerId}/bookings/${bookingId}/status`,
      null,
      {
        headers: this.getHeaders(),
        params: { status }
      }
    );
  }

  // Get seller analytics
  getAnalytics(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/analytics`, {
      headers: this.getHeaders()
    });
  }

  // Update car details
  updateCar(carId: number, carData: FormData): Observable<CarResponse> {
    return this.http.put<CarResponse>(
      `${this.apiUrl}/${carId}/update`,
      carData
    );
  }
  getCarById(id: number): Observable<Car> {
      return this.http.get<Car>(`${this.apiUrl}/${id}`);
    }

  addCar(formData: FormData): Observable<Car> {
      return this.http.post<Car>(`${this.apiUrl}`, formData).pipe(
        tap(() => {
          this.toastr.success('Car listed successfully!');
        })
      );
    }
  
    // updateCar(carId: number, formData: FormData): Observable<Car> {
    //   return this.http.put<Car>(`${this.apiUrl}/${carId}`, formData).pipe(
    //     tap(() => {
    //       this.toastr.success('Car details updated successfully!');
    //     })
    //   );
    // }
  
} 