import { TestBed } from '@angular/core/testing';

import { CastVoteRecordGeneratorService } from './cast-vote-record-generator.service';

describe('CastVoteRecordGeneratorService', () => {
  let service: CastVoteRecordGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CastVoteRecordGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
