import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { CardataService } from '../cardata.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SellerService } from '../services/seller.service';

@Component({
  selector: 'app-sellacar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sellacar.component.html',
  styleUrls: ['./sellacar.component.css']
})
export class SellacarComponent {
  carDetail = {
    registrationNumber: '',
    ownerName: '',
    carMake: '',
    carModel: '',
    variant: '',
    manufactureYear: 0,
    kms: 0,
    bodyType: '',
    numberOfOwners: 0,
    fuelType: '',
    transmissionType: '',
    vehicleLocation: '',
    vin: '',
    expectedPrice: 0,
    description: '',
    biddingAllowed: false,
    userId: 0
  };

  selectedFiles: File[] = [];
  loading = false;

  constructor(
    private cardataService: SellerService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.carDetail.userId = this.authService.currentUserValue?.userId || 0;
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.carDetail));
    
    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    this.cardataService.addCar(formData).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.toastr.success('Car details submitted successfully!', 'Success');
        setTimeout(() => {
          this.router.navigate(['/sellerdashboard']);
        }, 1500);
      },
      error: (error: any) => {
        this.loading = false;
        this.toastr.error(error.error || 'Failed to submit car details', 'Error');
      }
    });
  }

  private validateForm(): boolean {
    if (!this.carDetail.registrationNumber || !this.carDetail.carMake || 
        !this.carDetail.carModel || !this.carDetail.expectedPrice) {
      this.toastr.error('Please fill in all required fields', 'Validation Error');
      return false;
    }
    if (this.selectedFiles.length === 0) {
      this.toastr.error('Please select at least one image', 'Validation Error');
      return false;
    }
    return true;
  }
} 

