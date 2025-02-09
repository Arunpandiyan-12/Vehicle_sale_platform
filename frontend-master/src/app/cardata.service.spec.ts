import { TestBed } from '@angular/core/testing';

import { CardataService } from './cardata.service';

describe('CardataService', () => {
  let service: CardataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
