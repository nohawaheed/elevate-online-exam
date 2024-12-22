import { TestBed } from '@angular/core/testing';

import { SubjectAdapter } from './subject.adapter';

describe('SubjectAdapter', () => {
  let service: SubjectAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
