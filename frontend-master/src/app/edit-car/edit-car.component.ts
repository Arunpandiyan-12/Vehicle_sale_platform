import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SellerService, Car } from '../services/seller.service';
// import { CardataService ,Car } from '../cardata.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-car',
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditCarComponent implements OnInit {
  car!: Car;
  loading = false;
  selectedFiles: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private carService: SellerService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    const carId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCarDetails(carId);
  }

  loadCarDetails(carId: number) {
    this.loading = true;
    this.carService.getCarById(carId).subscribe({
      next: (car) => {
        this.car = car;
        this.loading = false;
      },
      error: (error) => {
        this.toastr.error('Error loading car details');
        this.loading = false;
      }
    });
  }

  onFileSelect(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit() {
    if (!this.car) return;

    const formData = new FormData();
    // Append car details
    Object.keys(this.car).forEach(key => {
      if (key !== 'imageUrls') {
        formData.append(key, String(this.car[key as keyof Car]));
      }
    });

    // Append new images if any
    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    this.loading = true;
    this.carService.updateCar(this.car.id, formData).subscribe({
      next: () => {
        this.toastr.success('Car updated successfully');
        this.router.navigate(['/sellerdashboard']);
      },
      error: (error) => {
        this.toastr.error('Error updating car');
        this.loading = false;
      }
    });
  }
} 