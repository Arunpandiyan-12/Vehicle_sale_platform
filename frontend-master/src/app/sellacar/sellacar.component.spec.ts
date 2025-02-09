import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellacarComponent } from './sellacar.component';

describe('SellacarComponent', () => {
  let component: SellacarComponent;
  let fixture: ComponentFixture<SellacarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellacarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellacarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
