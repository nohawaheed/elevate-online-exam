import { TestBed } from '@angular/core/testing';

import { NgxAuthApiAdapter } from './ngx-auth-api.adapter';

describe('NgxAuthApiAdapter', () => {
  let service: NgxAuthApiAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxAuthApiAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
