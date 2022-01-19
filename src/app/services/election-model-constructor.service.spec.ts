import { TestBed } from '@angular/core/testing';

import { ElectionModelConstructorService } from './election-model-constructor.service';

describe('ElectionModelConstructorService', () => {
  let service: ElectionModelConstructorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectionModelConstructorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
