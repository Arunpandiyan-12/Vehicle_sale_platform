import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarslistComponent } from './carslist.component';

describe('CarslistComponent', () => {
  let component: CarslistComponent;
  let fixture: ComponentFixture<CarslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarslistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarslistComponent);
    component = fixture.componentInstance;
    
     
    component.loading = false;
    component.error = false;
    component.cars = [];
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
