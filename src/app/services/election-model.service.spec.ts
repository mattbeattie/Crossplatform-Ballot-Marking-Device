import { TestBed } from '@angular/core/testing';

import { ElectionModelService } from './election-model.service';

describe('ElectionModelService', () => {
  let service: ElectionModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectionModelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
