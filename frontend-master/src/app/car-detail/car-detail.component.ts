import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardataService, Car } from '../cardata.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormatEstimatePipe } from '../pipes/format-estimate.pipe';
import { AuthService } from '../auth.service';
import { BookingService, Booking } from '../services/booking.service';

@Component({
  selector: 'app-cardetails',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    CurrencyPipe,
    FormatEstimatePipe
  ]
})
export class CarDetailComponent implements OnInit {
  carData!: Car; // Holds the selected car details
  estimatedPrice: string = ''; // Change to string type
  bidPrice: number = 1000; // Default bid
  message: string = '';
  currentImageIndex: number = 0;
  
  // Add missing properties
  minPrice: number = 0;
  maxPrice: number = 100000;
  price: number = 0;
  dealType: string = 'Good Deal';
  priceDifference: number = 0;
  bidAmount: number = 0;
  loading = false;
  showEstimateModal = false;
  showImagePopup = false;
  carId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private carService: CardataService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.loadCarDetails();
  }

  loadCarDetails() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carId = id;

    this.carService.getCarById(id).subscribe({
      next: (car) => {
        this.carData = car;
        this.price = car.expectedPrice;
        // Calculate price difference and deal type
        this.calculatePriceDifference();
        // Fetch estimated car price
        this.fetchEstimatedCarPrice();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 401) {
          // Handle unauthorized access
          this.toastr.error('Please login to view car details');
          this.router.navigate(['/signin'], { 
            queryParams: { returnUrl: this.router.url } 
          });
        } else {
          this.toastr.error('Error loading car details');
        }
        console.error('Error fetching car details:', error);
      }
    });
  }

  calculatePriceDifference() {
    const estimatedValue = this.extractNumericValue(this.estimatedPrice);
    if (estimatedValue) {
      this.priceDifference = Math.abs(this.carData.expectedPrice - estimatedValue);
      this.dealType = this.carData.expectedPrice < estimatedValue ? 'Good Deal' : 'Over Priced';
    }
  }

  extractNumericValue(priceString: string): number | null {
    // Extract numeric value from the AI response string
    const matches = priceString.match(/\d+/);
    return matches ? parseInt(matches[0]) : null;
  }

  fetchEstimatedCarPrice() {
    this.carService.fetchEstimatedCarPrice(this.carData.id).subscribe({
      next: (response) => {
        this.estimatedPrice = response;
        this.calculatePriceDifference();
      },
      error: (error) => {
        console.error('Error fetching estimated price:', error);
        this.toastr.error('Failed to get price estimate');
      }
    });
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.carData.imageUrls.length - 1;
    }
  }

  nextImage(): void {
    if (this.currentImageIndex < this.carData.imageUrls.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
  }

  setImage(index: number) {
    this.currentImageIndex = index;
  }

  // Bid submission logic
  onBidChange(): void {
    const slider = document.querySelector('.bid-slider') as HTMLInputElement;
    const value = ((+slider.value - +slider.min) / (+slider.max - +slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, #920000 0%, #920000 ${value}%, #000 ${value}%, #000 100%)`;
  }

  sendBid(): void {
    alert(`Hi, I would like to bid $${this.bidPrice} for this vehicle.\n\nMessage: ${this.message}`);
  }

  bookCar(): void {
    // Logic to notify admin and seller
    alert('Car booked successfully! Notification sent to admin and seller.');
    // Implement actual notification logic here
  }

  get minBidAmount(): number {
    // Calculate minimum bid amount (2 lakhs less than expected price)
    const reduction = this.carData.expectedPrice * 0.2; // 20% less than expected price
    return Math.max(this.carData.expectedPrice - reduction, 0);
  }

  isValidBid(): boolean {
    // Only check minimum bid amount, no maximum restriction
    return this.bidAmount >= this.minBidAmount;
  }

  submitBid() {
    if (!this.isValidBid()) {
      this.toastr.error(`Bid amount must be at least ₹${this.minBidAmount.toLocaleString()}`);
      return;
    }

    // Implement bid submission logic here
    this.toastr.success('Bid submitted successfully');
  }

  showInterest() {
    if (!this.authService.isAuthenticated) {
      this.authService.setLastAccessedUrl(this.router.url);
      this.router.navigate(['/signin']);
      return;
    }

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.toastr.error('User information not found');
      return;
    }

    const bookingData: Partial<Booking> = {
      carId: this.carData.id,
      sellerId: this.carData.userId,
      buyerId: currentUser.userId,
      status: 'Pending' as const,
      bidAmount: this.carData.biddingAllowed ? this.bidAmount : null,
      sellerMessage: "I'm interested to buy"
    };

    this.loading = true;
    this.bookingService.createBooking(bookingData).subscribe({
      next: (response) => {
        this.toastr.success('Interest shown successfully! The seller will contact you soon.');
        this.loading = false;
      },
      error: (error) => {
        // Check if it's a 200 status with text message
        if (error.status === 200 && error.error.text) {
          this.toastr.info(error.error.text);
        } else {
          this.toastr.error('Failed to show interest. Please try again.');
        }
        this.loading = false;
      }
    });
  }

  getEstimatedPrice() {
    this.loading = true;
    this.carService.fetchEstimatedCarPrice(this.carData.id).subscribe({
      next: (response) => {
        this.estimatedPrice = response;
        this.showEstimateModal = true;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Failed to get price estimate');
        this.loading = false;
      }
    });
  }

  closeEstimateModal() {
    this.showEstimateModal = false;
  }

  openImagePopup(index: number) {
    this.currentImageIndex = index;
    this.showImagePopup = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
  }

  closeImagePopup() {
    this.showImagePopup = false;
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Add method to check if user has already booked
  hasUserBooked(): boolean {
    return false; // This will be implemented when we add booking status check
  }
}
