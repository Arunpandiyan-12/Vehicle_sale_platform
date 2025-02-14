import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, catchError, throwError } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

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

export interface EstimateRequest {
  carMake: string;
  carModel: string;
  manufactureYear: number;
  vehicleLocation: string;
}

// cardata.service.ts
@Injectable({
  providedIn: 'root'
})
export class CardataService {
  private apiUrl = 'http://localhost:8082/cars';
  private publicApiUrl = 'http://localhost:8084/carslist'; // Public endpoint

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Public endpoints (no auth required)
  getApprovedCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.publicApiUrl);
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.publicApiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching car:', error);
        return throwError(() => error);
      })
    );
  }

  // getFilteredCars(filters: any): Observable<Car[]> {
  //   return of([]); 
  // }

  getAvailableMakes(): Observable<string[]> {
    return this.getApprovedCars().pipe(
      map(cars => [...new Set(cars.map(car => car.carMake))].sort()),
      catchError(error => {
        console.error('Error fetching makes:', error);
        return of([]);
      })
    );
  }

  getAvailableModels(make: string): Observable<string[]> {
    return this.getApprovedCars().pipe(
      map(cars => [...new Set(
        cars
          .filter(car => car.carMake === make)
          .map(car => car.carModel)
      )].sort()),
      catchError(error => {
        console.error('Error fetching models:', error);
        return of([]);
      })
    );
  }

  getAvailableYears(): Observable<number[]> {
    return this.getApprovedCars().pipe(
      map(cars => [...new Set(cars.map(car => car.manufactureYear))]
        .sort((a, b) => b - a)), // Sort in descending order
      catchError(error => {
        console.error('Error fetching years:', error);
        return of([]);
      })
    );
  }

  getFuelTypes(): Observable<string[]> {
    return this.getApprovedCars().pipe(
      map(cars => [...new Set(cars.map(car => car.fuelType))].sort()),
      catchError(error => {
        console.error('Error fetching fuel types:', error);
        return of([]);
      })
    );
  }

  getTransmissionTypes(): Observable<string[]> {
    return this.getApprovedCars().pipe(
      map(cars => [...new Set(cars.map(car => car.transmissionType))].sort()),
      catchError(error => {
        console.error('Error fetching transmission types:', error);
        return of([]);
      })
    );
  }

  getModelsByMake(make: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.publicApiUrl}/models/${make}`).pipe(
      catchError(error => {
        console.error('Error fetching models:', error);
        return of([]);
      })
    );
  }

  // Protected endpoints (auth required)
  fetchEstimatedCarPrice(carId: number): Observable<string> {
    return this.http.post(`${this.publicApiUrl}/estimate-price/${carId}`, {}, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  // addCar(formData: FormData): Observable<Car> {
  //   return this.http.post<Car>(`${this.apiUrl}`, formData, {
  //     headers: this.getHeaders()
  //   }).pipe(
  //     tap(() => {
  //       this.toastr.success('Car listed successfully!');
  //     })
  //   );
  // }

  // updateCar(carId: number, formData: FormData): Observable<Car> {
  //   return this.http.put<Car>(`${this.apiUrl}/${carId}`, formData, {
  //     headers: this.getHeaders()
  //   }).pipe(
  //     tap(() => {
  //       this.toastr.success('Car details updated successfully!');
  //     })
  //   );
  // }

  estimateCarPrice(details: EstimateRequest): Observable<string> {
    return this.http.post(`${this.publicApiUrl}/estimate-price`, details, {
      responseType: 'text'
    }).pipe(
      catchError(error => {
        console.error('Error estimating price:', error);
        return throwError(() => error);
      })
    );
  }

  getTrendingCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.apiUrl}/trending-cars`);
  }
  getAllCars(): Observable<Car[]> {
    return this.http.get<Car[]>(`${this.publicApiUrl}/filter`);
  }
  // Other protected endpoints...
}
