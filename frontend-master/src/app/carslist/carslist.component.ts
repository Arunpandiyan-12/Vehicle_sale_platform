import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Car, CardataService } from '../cardata.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

interface CarFilters {
  carMake: string;
  carModel: string;
  manufactureYearStart: number;
  priceMin: number;
  priceMax: number;
  kmsMin: number;
  kmsMax: number;
  fuelType: string;
  transmissionType: string;
  bodyType: string;
}

@Component({
  selector: 'app-carslist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carslist.component.html',
  styleUrls: ['./carslist.component.css']
})
export class CarslistComponent implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  makes: string[] = [];
  models: string[] = [];
  years: number[] = [];
  fuelTypes: string[] = [];
  transmissionTypes: string[] = [];
  loading: boolean = true;
  error: string = '';
  selectedBrand: string = '';
  selectedBodyType: string = '';
  bodyTypes: string[] = [];
  pageSize: number = 12;
  searchFilters = {
    make: '',
    model: '',
    year: '',
    location: ''
  };

  filters: CarFilters = {
    carMake: '',
    carModel: '',
    manufactureYearStart: 0,
    priceMin: 0,
    priceMax: 0,
    kmsMin: 0,
    kmsMax: 0,
    fuelType: '',
    transmissionType: '',
    bodyType: ''
  };

  // Add pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 1;
  displayedCars: Car[] = [];
  searchQuery: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private carService: CardataService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loading = true;
    // Load cars first, then extract filter options
    this.carService.getApprovedCars().subscribe({
      next: (cars) => {
        this.cars = cars;
        this.filteredCars = cars;
        this.loadFilterOptions();
        this.totalPages = Math.ceil(this.cars.length / this.itemsPerPage);
        this.updateDisplayedCars();
        
        // Apply filters from URL params
        this.route.queryParams.subscribe(params => {
          if (params['brand']) {
            this.filters.carMake = params['brand'];
            this.filteredCars = this.cars.filter(car => 
              car.carMake.toLowerCase() === params['brand'].toLowerCase()
            );
          }
          if (params['bodyType']) {
            this.filteredCars = this.cars.filter(car => 
              car.bodyType.toLowerCase() === params['bodyType'].toLowerCase()
            );
          }
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this.error = 'Failed to load cars. Please try again later.';
        this.loading = false;
        this.toastr.error('Error loading cars');
      }
    });
  }

  loadFilterOptions() {
    // Extract unique values from loaded cars
    this.makes = [...new Set(this.cars.map(car => car.carMake))].sort();
    this.models = [...new Set(this.cars.map(car => car.carModel))].sort(); // Load all models initially
    this.fuelTypes = [...new Set(this.cars.map(car => car.fuelType))].sort();
    this.transmissionTypes = [...new Set(this.cars.map(car => car.transmissionType))].sort();
    this.years = [...new Set(this.cars.map(car => car.manufactureYear))]
      .sort((a, b) => b - a);
    this.bodyTypes = [...new Set(this.cars.map(car => car.bodyType))].sort();
  }

  onMakeChange() {
    // Reset model selection
    this.filters.carModel = '';
    
    if (this.filters.carMake) {
      // Filter models for selected make
      this.models = [...new Set(
        this.cars
          .filter(car => car.carMake === this.filters.carMake)
          .map(car => car.carModel)
      )].sort();
    } else {
      // If no make selected, show all models
      this.models = [...new Set(this.cars.map(car => car.carModel))].sort();
    }
  }

  resetFilters() {
    this.filters = {
      carMake: '',
      carModel: '',
      manufactureYearStart: 0,
      priceMin: 0,
      priceMax: 0,
      kmsMin: 0,
      kmsMax: 0,
      fuelType: '',
      transmissionType: '',
      bodyType: ''
    };
    // Reset to original car list instead of reloading
    this.filteredCars = this.cars;
    this.models = []; // Clear models when resetting
  }

  applyFilters() {
    this.filteredCars = this.cars.filter(car => {
        const matchesMake = !this.filters.carMake || car.carMake === this.filters.carMake;
        const matchesModel = !this.filters.carModel || car.carModel === this.filters.carModel;
        const matchesYear = !this.filters.manufactureYearStart || car.manufactureYear >= this.filters.manufactureYearStart;
        const matchesFuelType = !this.filters.fuelType || car.fuelType === this.filters.fuelType;
        const matchesTransmission = !this.filters.transmissionType || car.transmissionType === this.filters.transmissionType;
        const matchesBodyType = !this.filters.bodyType || car.bodyType === this.filters.bodyType;
        
        const matchesPrice = (!this.filters.priceMin || car.expectedPrice >= this.filters.priceMin) &&
                           (!this.filters.priceMax || car.expectedPrice <= this.filters.priceMax);
        
        const matchesKms = (!this.filters.kmsMin || car.kms >= this.filters.kmsMin) &&
                          (!this.filters.kmsMax || car.kms <= this.filters.kmsMax);

        return matchesMake && matchesModel && matchesYear && matchesFuelType && 
               matchesTransmission && matchesPrice && matchesKms && matchesBodyType;
    });
    
    if (this.filteredCars.length === 0) {
      this.toastr.info('No cars match your filter criteria');
    }
  }

  viewDetails(id: number) {
    this.router.navigate(['/car-details', id]);
  }

  

  // Pagination methods
  updateDisplayedCars() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedCars = this.filteredCars.slice(startIndex, endIndex);
  }

  onPageSizeChange(size: number) {
    this.itemsPerPage = size;
    this.totalPages = Math.ceil(this.filteredCars.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updateDisplayedCars();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedCars();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedCars();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedCars();
    }
  }

  getVisiblePages(): number[] {
    const delta = 2; // Number of pages to show on either side of current page
    const range: number[] = [];
    let start = Math.max(2, this.currentPage - delta);
    let end = Math.min(this.totalPages - 1, this.currentPage + delta);
  
    // Generate range between start and end
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
  
    // Add dots if range doesn't connect to first/last page
    if (start > 2) {
      range.unshift(-1); // Add dots before range
    }
    if (end < this.totalPages - 1) {
      range.push(-1); // Add dots after range
    }
  
    // Always include first and last pages
    range.unshift(1);
    if (this.totalPages > 1) {
      range.push(this.totalPages);
    }
  
    return range;
  }
  
  // Update search method
  onSearch(event: Event) {
    event.preventDefault();
    const query = this.searchQuery.toLowerCase().trim();
    
    if (query) {
      this.filteredCars = this.cars.filter(car => 
        car.carMake.toLowerCase().includes(query) ||
        car.carModel.toLowerCase().includes(query) ||
        car.vehicleLocation.toLowerCase().includes(query) ||
        car.manufactureYear.toString().includes(query)
      );
    } else {
      this.filteredCars = this.cars;
    }

    this.totalPages = Math.ceil(this.filteredCars.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updateDisplayedCars();
  }
}
