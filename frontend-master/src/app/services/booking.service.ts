import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  id: number;
  buyerId: number;
  carId: number;
  sellerId: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
  bidAmount: number | null;
  email: string;
  sellerMessage: string;
  username: string;
}

export interface CarWithBookings {
  carDetail: {
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
    status: string;
    userId: number;
    biddingAllowed: boolean;
    bookingCount: number;
    isSold: boolean;
  };
  bookings: Booking[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8085/bookings';

  constructor(private http: HttpClient) {}

  createBooking(bookingData: Partial<Booking>): Observable<string> {
    return this.http.post(`${this.apiUrl}/create`, bookingData, {
      responseType: 'text'
    });
  }

  getSellerBookings(sellerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/seller/${sellerId}`);
  }

  getBuyerBookings(buyerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/buyer/${buyerId}`);
  }

  getCarDetailsWithBookings(carId: number): Observable<CarWithBookings> {
    return this.http.get<CarWithBookings>(`${this.apiUrl}/${carId}/details-with-bookings`);
  }

  updateBookingStatus(sellerId: number, bookingId: number, status: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${sellerId}/bookings/${bookingId}/status?status=${status}`, {}, 
    { responseType: 'text' as 'json' });
  }
} 