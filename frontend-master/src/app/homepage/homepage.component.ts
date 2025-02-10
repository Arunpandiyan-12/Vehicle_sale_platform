import { Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CardataService } from '../cardata.service';
import { ChatbotComponent } from "../chatbot/chatbot.component";
import { PriceEstimatorComponent } from "../price-estimator/price-estimator.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  imports: [ChatbotComponent, PriceEstimatorComponent,CommonModule]
})
export class HomepageComponent implements OnInit, AfterViewInit {
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

  @ViewChild('myVideo') videoPlayer!: ElementRef;

  private observer: IntersectionObserver | null = null;
  isCardVisible = false;
  isCarTypeVisible = false;
  isTrendingVisible = false;
  isAdvantagesVisible = false;
  showScrollTop = false;
  trendingCars: any[] = [];
  navbar!: HTMLElement | null;
  videoSection!: HTMLElement | null;
  heroSection!: HTMLElement | null;
  exploreSection!: HTMLElement | null;
  carTypeSection!: HTMLElement | null;
  trendingSection!: HTMLElement | null;
  advantagesSection!: HTMLElement | null;
  
  
  constructor(private router: Router, private carDataService: CardataService, private ngZone: NgZone) {}

  ngOnInit() {
    this.cacheDOMElements();
    this.setupIntersectionObserver();
    
    // Run only after the DOM is stable
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.checkCarTypesVisibility(), 100);
      setTimeout(() => this.initVideo(), 100);
    });
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => this.checkScroll(), 100);
    });
  }

  cacheDOMElements() {
    this.navbar = document.querySelector('.navbar');
    this.videoSection = document.querySelector('.video-section');
    this.heroSection = document.querySelector('.hero');
    this.exploreSection = document.querySelector('.explore-section');
    this.carTypeSection = document.querySelector('.car-types-section');
    this.trendingSection = document.querySelector('.trending-section');
    this.advantagesSection = document.querySelector('.advantages-section');
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target as HTMLVideoElement;
          if (video.paused) {
            video.muted = true;
            video.play().catch(() => console.log('Waiting for user interaction'));
          }
        }
      });
    });

    if (this.videoPlayer?.nativeElement) {
      this.observer.observe(this.videoPlayer.nativeElement);
    }
  }

  initVideo() {
    const video = this.videoPlayer?.nativeElement;
    if (video) {
      video.muted = true;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => console.log('Waiting for user interaction'));
      });
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.throttledCheckScroll();
  }

  throttledCheckScroll = this.throttle(() => {
    this.checkScroll();
  }, 200);

  viewCarDetails(carId: number) {
    this.router.navigate(['/car-details', carId]);
  }
  checkScroll() {
    if (this.navbar && this.videoSection) {
      const videoRect = this.videoSection.getBoundingClientRect();
      this.navbar.classList.toggle('at-top', videoRect.top < 0 && videoRect.bottom > 0);
    }

    if (this.heroSection) {
      const rect = this.heroSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.7) {
        this.heroSection.querySelector('.hero-content')?.classList.add('active');
        setTimeout(() => this.heroSection?.querySelector('.hero-image')?.classList.add('active'), 400);
      }
    }

    if (this.exploreSection) {
      this.isCardVisible = this.exploreSection.getBoundingClientRect().top < window.innerHeight * 0.8;
    }

    if (this.carTypeSection) {
      this.isCarTypeVisible = this.carTypeSection.getBoundingClientRect().top <= window.innerHeight * 0.75;
    }

    if (this.trendingSection && !this.isTrendingVisible) {
      const rect = this.trendingSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        this.isTrendingVisible = true;
        this.loadTrendingCars();
      }
    }

    if (this.advantagesSection) {
      this.isAdvantagesVisible = this.advantagesSection.getBoundingClientRect().top < window.innerHeight * 0.8;
    }

    this.showScrollTop = window.scrollY > 500;
  }

  loadTrendingCars() {
    this.carDataService.getTrendingCars().subscribe({
      next: (cars) => (this.trendingCars = cars.slice(0, 8)),
      error: (error) => console.error('Error loading trending cars:', error)
    });
  }
  
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  filterByBrand(brandName: string) {
    this.router.navigate(['/carslist'], { queryParams: { brand: brandName } });
  }

  filterByBodyType(bodyType: string) {
    this.router.navigate(['/carslist'], { queryParams: { bodyType: bodyType } });
  }

  checkCarTypesVisibility() {
    if (this.carTypeSection) {
      this.isCarTypeVisible = this.carTypeSection.getBoundingClientRect().top < window.innerHeight * 0.75;
    }
  }

  throttle(func: Function, limit: number) {
    let lastFunc: number;
    let lastRan: number;
    return function (...args: any) {
      if (!lastRan) {
        func(...args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = window.setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func(...args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }
}
