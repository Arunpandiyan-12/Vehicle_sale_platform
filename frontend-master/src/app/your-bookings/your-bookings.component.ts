import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { CardataService } from '../cardata.service';

@Component({
  selector: 'app-your-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './your-bookings.component.html',
  styleUrls: ['./your-bookings.component.css']
})
export class YourBookingsComponent implements OnInit {
  bookings: any[] = [];
  cars: any[] = [];

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private carDataService: CardataService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    const userId = this.authService.currentUserValue?.userId;
    if (!userId) return;

    this.bookingService.getBuyerBookings(userId).subscribe({
      next: (data) => {
        this.bookings = data;
        this.loadCarDetails();
      },
      error: () => {
        this.toastr.error('Failed to load bookings');
      }
    });
  }

  loadCarDetails() {
    const carIds = [...new Set(this.bookings.map(booking => booking.carId))];
    
    carIds.forEach(carId => {
      this.carDataService.getCarById(carId).subscribe({
        next: (car) => {
          this.cars.push(car);
        },
        error: () => {
          this.toastr.error(`Failed to load car details`);
        }
      });
    });
  }

  getCarDetails(carId: number) {
    return this.cars.find(car => car.id === carId);
  }

  getStatusMessage(status: string): string {
    switch(status?.toUpperCase()) {
      case 'PENDING': return 'Waiting for seller response';
      case 'ACCEPTED': return 'Booking accepted by seller';
      case 'REJECTED': return 'Booking rejected by seller';
      default: return 'Status unknown';
    }
  }
} 