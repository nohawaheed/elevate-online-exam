import { TestBed } from '@angular/core/testing';

import { NgxAuthApiService } from './ngx-auth-api.service';

describe('NgxAuthApiService', () => {
  let service: NgxAuthApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxAuthApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
