import { TestBed } from '@angular/core/testing';

import { ExamAdapter } from './exam.adapter';

describe('ExamAdapter', () => {
  let service: ExamAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
