import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PriceEstimatorComponent } from '../price-estimator/price-estimator.component';
import { CardataService ,Car} from '../cardata.service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PriceEstimatorComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, AfterViewInit {
  @ViewChild('myVideo') videoPlayer!: ElementRef;
  private observer: IntersectionObserver | null = null;
  isCardVisible = false;
  isCarTypeVisible = false;
  trendingCars: any[] = [];
  isTrendingVisible = false;
  isAdvantagesVisible = false;
  showScrollTop = false;

  constructor(
    private router: Router,
    private carDataService: CardataService
  ) {}
  
  login() {
    this.router.navigate(['/signin']);
  }
  
  sellacar() {
    this.router.navigate(['/sellacar']);
  }
  
  explorecars() {
    this.router.navigate(['/carslist']);
  }
  
  Serviceprovider() {
    this.router.navigate(['/serviceprovider']);
  }
  
  homepage() {
    this.router.navigate(['/homepage']);
  }
  
  register() {
    this.router.navigate(['/registration']);
  }

  cars = [
    { name: 'Toyota', imgPath: 'toyota.png' },
    { name: 'Volkswagen', imgPath: 'volkswagen.png' },
    { name: 'Ford', imgPath: 'ford.png' },
    { name: 'Audi', imgPath: 'audi.png' },
    { name: 'Kia', imgPath: 'kia.png' },
    { name: 'Hyundai', imgPath: 'hyundai.png' },
    { name: 'Mahindra', imgPath: 'mahindra.png' },
    { name: 'BMW', imgPath: 'bmw.png' }
  ];

  carTypes = [
    // First row
    { name: 'SUV', image: 'pic-main/1.png' },
    { name: 'Sedan', image: 'pic-main/2.png' },
    { name: 'Hatchback', image: 'pic-main/3.png' },
    { name: 'Sports', image: 'pic-main/4.png' },
   
    { name: 'Luxury', image: 'pic-main/5.png' },
    { name: 'Electric', image: 'pic-main/6.png' },
    { name: 'Compact', image: 'pic-main/7.png' },
    { name: 'Premium', image: 'pic-main/8.png' }
  ];

  ngOnInit() {
    this.checkScroll();
    this.setupIntersectionObserver();
    setTimeout(() => {
      this.checkCarTypesVisibility();
    }, 100);
    
    // Ensure video plays
    setTimeout(() => {
      const video = this.videoPlayer.nativeElement;
      video.muted = true;  // Ensure muted
      video.play().catch((error: any) => {
        console.log("Video autoplay failed:", error);
      });
    }, 100);
  }

  ngAfterViewInit() {
    this.initVideo();
    // Force check scroll position on load
    setTimeout(() => {
      this.checkScroll();
    }, 100);
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target as HTMLVideoElement;
          if (video.paused) {
            video.muted = true; // Ensure muted
            video.play().catch(() => {
              // Silently handle autoplay rejection
              console.log('Waiting for user interaction');
            });
          }
        }
      });
    });
  }

  initVideo() {
    const video = document.getElementById('myVideo') as HTMLVideoElement;
    if (video && this.observer) {
      this.observer.observe(video);
      
      // Ensure video is muted before attempting to play
      video.muted = true;
      
      // Add event listener for when metadata is loaded
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {
          // Silently handle autoplay rejection
          console.log('Waiting for user interaction');
        });
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    // For navbar transparency
    const navbar = document.querySelector('.navbar') as HTMLElement;
    const videoSection = document.querySelector('.video-section') as HTMLElement;
    
    if (videoSection && navbar) {
      const videoRect = videoSection.getBoundingClientRect();
      const isInView = videoRect.top < 0 && videoRect.bottom > 0;
      
      if (isInView) {
        navbar.classList.add('at-top');
      } else {
        navbar.classList.remove('at-top');
      }
    }

    // For hero section animations
    const heroSection = document.querySelector('.hero') as HTMLElement;
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.7; // Trigger when section is 70% in view
      
      if (rect.top < triggerPoint) {
        // Add active class to hero content
        const content = heroSection.querySelector('.hero-content');
        if (content && !content.classList.contains('active')) {
          content.classList.add('active');
        }
        
        // Add active class to hero image
        const image = heroSection.querySelector('.hero-image');
        if (image && !image.classList.contains('active')) {
          // Add active class after a short delay
          setTimeout(() => {
            image.classList.add('active');
          }, 400);
        }
      }
    }

    // For explore section animations
    const exploreSection = document.querySelector('.explore-section');
    if (exploreSection) {
      const rect = exploreSection.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.8;

      if (rect.top < triggerPoint) {
        this.isCardVisible = true;
      }
    }

    // For car types section animation
    const carTypeSection = document.querySelector('.car-types-section');
    if (carTypeSection) {
      const rect = carTypeSection.getBoundingClientRect();
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
      if (rect.top <= viewHeight * 0.75 && rect.bottom >= 0) {
        this.isCarTypeVisible = true;
      }
    }

    // For trending section animation
    const trendingSection = document.querySelector('.trending-section');
    if (trendingSection) {
      const rect = trendingSection.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.8;

      if (rect.top < triggerPoint && !this.isTrendingVisible) {
        this.isTrendingVisible = true;
        this.loadTrendingCars();
      }
    }

    // For advantages section animation
    const advantagesSection = document.querySelector('.advantages-section');
    if (advantagesSection) {
        const rect = advantagesSection.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.8;

        if (rect.top < triggerPoint) {
            this.isAdvantagesVisible = true;
        }
    }

    // Show/hide scroll to top button
    this.showScrollTop = window.pageYOffset > 500;
  }

  loadTrendingCars() {
    this.carDataService.getTrendingCars().subscribe({
      next: (cars) => {
        this.trendingCars = cars.slice(0, 8);
      },
      error: (error) => {
        console.error('Error loading trending cars:', error);
      }
    });
  }

  viewCarDetails(carId: number) {
    this.router.navigate(['/car-details', carId]);
  }

  scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
  }

  // Simple brand filter
  filterByBrand(brandName: string) {
    this.router.navigate(['/carslist'], {
      queryParams: { brand: brandName }
    });
  }

  // Simple body type filter
  filterByBodyType(bodyType: string) {
    this.router.navigate(['/carslist'], {
      queryParams: { bodyType: bodyType }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkCarTypesVisibility();
  }

  checkCarTypesVisibility() {
    const carTypesSection = document.querySelector('.car-types-section');
    if (carTypesSection) {
      const rect = carTypesSection.getBoundingClientRect();
      const triggerPoint = window.innerHeight * 0.75;

      if (rect.top < triggerPoint) {
        this.isCarTypeVisible = true;
      }
    }
  }
}
