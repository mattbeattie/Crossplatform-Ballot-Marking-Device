import { TestBed } from '@angular/core/testing';

import { CvrGeneratorService } from './cvr-generator.service';

describe('CvrGeneratorService', () => {
  let service: CvrGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CvrGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
