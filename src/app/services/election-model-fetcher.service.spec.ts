import { TestBed } from '@angular/core/testing';

import { ElectionFileFetcherService } from './election-model-fetcher.service';

describe('ElectionFileFetcherService', () => {
  let service: ElectionFileFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectionFileFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
