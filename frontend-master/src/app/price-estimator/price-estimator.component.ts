import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CardataService } from '../cardata.service';
import { ToastrService } from 'ngx-toastr';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-price-estimator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './price-estimator.component.html',
  styleUrls: ['./price-estimator.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class PriceEstimatorComponent implements OnInit {
  estimateData = {
    carMake: '',
    carModel: '',
    manufactureYear: 2024,
    vehicleLocation: ''
  };

  loading = false;
  showModal = false;
  estimatedPrice: string = '';

  constructor(
    private carService: CardataService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    // Add any initialization logic here
  }

  getEstimate() {
    if (!this.estimateData.carMake || !this.estimateData.carModel || 
        !this.estimateData.manufactureYear || !this.estimateData.vehicleLocation) {
      this.toastr.error('Please fill all fields');
      return;
    }

    this.loading = true;
    this.carService.estimateCarPrice(this.estimateData).subscribe({
      next: (price) => {
        this.estimatedPrice = price;
        this.loading = false;
        this.showModal = true;
      },
      error: (err) => {
        console.error('Error getting estimate:', err);
        this.toastr.error('Failed to get estimate');
        this.loading = false;
      }
    });
  }

  closeModal() {
    this.showModal = false;
  }

  sellYourCar() {
    this.router.navigate(['/sellacar']);
  }
} 