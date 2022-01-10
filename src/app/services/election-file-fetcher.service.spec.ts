import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ElectionFileFetcherService } from './election-file-fetcher.service';

describe('ElectionFileFetcherService', () => {
  let service: ElectionFileFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ElectionFileFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
