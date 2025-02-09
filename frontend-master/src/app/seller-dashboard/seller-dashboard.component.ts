import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
// import { CardataService, Car } from '../cardata.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../services/booking.service';
import { CurrencyPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SellerService ,Car} from '../services/seller.service';
import { HttpHeaders } from '@angular/common/http';



export interface CarResponse {
  carDetailDtoList: Car[];
  userDto: {
    userId: number;
    username: string;
    email: string;
    role: string;
  };
}

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe, FontAwesomeModule]
})
export class SellerDashboardComponent implements OnInit {
  cars: Car[] = [];
  bookings: any[] = [];
  activeTab = 'listings';
  stats = {
    totalListings: 0,
    pendingApprovals: 0,
    soldCars: 0,
    activeBookings: 0
  };
  loading = false;

  constructor(
    private sellerService: SellerService,
    private bookingService: BookingService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    const userId = this.authService.currentUserValue?.userId;
    
    if (!userId) {
      this.toastr.error('User not found');
      this.loading = false;
      return;
    }

    this.sellerService.getSellerCars(userId).subscribe({
      next: (response: CarResponse[]) => {
        this.cars = response.flatMap(r => r.carDetailDtoList);
        this.updateStats();
        this.loading = false;
        
        // Show notifications based on car status
        this.showStatusNotifications();
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this.toastr.error('Error loading your listings');
        this.loading = false;
      }
    });

    // Get seller's bookings
    this.sellerService.getSellerBookings(userId).subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.stats.activeBookings = bookings.filter(b => b.status === 'PENDING').length;
      },
      error: (error) => {
        this.toastr.error('Error loading bookings');
      }
    });
  }

  showStatusNotifications() {
    const pendingCars = this.cars.filter(car => car.status === 'PENDING');
    const approvedCars = this.cars.filter(car => car.status === 'APPROVED');
    const rejectedCars = this.cars.filter(car => car.status === 'REJECTED');

    if (pendingCars.length > 0) {
      this.toastr.info(`You have ${pendingCars.length} car(s) pending admin approval`);
    }
    if (approvedCars.length > 0) {
      this.toastr.success(`You have ${approvedCars.length} approved listings`);
    }
    if (rejectedCars.length > 0) {
      this.toastr.warning(`You have ${rejectedCars.length} rejected listings`);
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved': return 'badge bg-success';
      case 'rejected': return 'badge bg-danger';
      case 'pending': return 'badge bg-warning';
      default: return 'badge bg-secondary';
    }
  }

  getStatusMessage(car: Car): string {
    if (car.isSold) {
      return 'Sold';
    }
    switch (car.status?.toLowerCase()) {
      case 'approved': return 'Listed for Sale';
      case 'rejected': return 'Listing Rejected';
      case 'pending': return 'Waiting for Admin Approval';
      default: return 'Status Unknown';
    }
  }

  updateStats() {
    this.stats.totalListings = this.cars.length;
    this.stats.pendingApprovals = this.cars.filter(car => car.status === 'PENDING').length;
    this.stats.soldCars = this.cars.filter(car => car.isSold).length;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  handleBooking(bookingId: number, status: 'ACCEPTED' | 'REJECTED') {
    const sellerId = this.authService.currentUserValue?.userId;
    if (!sellerId) return;

    this.sellerService.updateBookingStatus(sellerId, bookingId, status).subscribe({
      next: (response) => {
        this.toastr.success(`Booking ${status.toLowerCase()} successfully`);
        this.loadDashboardData(); // Reload to get updated booking list

      },
      error: (error) => {
        this.toastr.error('Failed to update booking status');
      }
    });
  }

  markAsSold(carId: number) {
    if (confirm('Are you sure you want to mark this car as sold?')) {
      this.sellerService.markCarAsSold(carId).subscribe({
        next: () => {
          this.toastr.success('Car marked as sold successfully');
          this.loadDashboardData();
        },
        error: (error) => {
          this.toastr.error('Error marking car as sold');
        }
      });
    }
  }

  getCarImage(carId: number): string {
    const car = this.cars.find(c => c.id === carId);
    return car?.imageUrls[0] || 'assets/default-car.png';
  }

  getCarName(carId: number): string {
    const car = this.cars.find(c => c.id === carId);
    return car ? `${car.carMake} ${car.carModel}` : 'Unknown Car';
  }

  hasPendingCars(): boolean {
    return this.cars.length > 0 && this.cars.some(car => car.status === 'PENDING');
  }

  editCar(car: Car) {
    this.router.navigate(['/edit-car', car.id]);
  }

  getCarDetails(carId: number) {
    return this.cars.find(car => car.id === carId);
  }
}