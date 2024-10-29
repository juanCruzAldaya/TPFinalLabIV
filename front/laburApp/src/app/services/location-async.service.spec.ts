import { TestBed } from '@angular/core/testing';

import { LocationAsyncService } from './location-async.service';

describe('LocationAsyncService', () => {
  let service: LocationAsyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationAsyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
