import { Injectable } from '@angular/core';
import { Adapter } from '../interfaces/adapter';
import { AllSubjects } from '../interfaces/subject';

@Injectable({
  providedIn: 'root',
})
export class SubjectAdapter implements Adapter {
  constructor() {}
  adaptSubject(data: AllSubjects): any {
    let result = {
      message: data.message,
      metadata: {
        currentPage: data.metadata.currentPage,
        numberOfPages: data.metadata.numberOfPages,
      },
      subjects: data.subjects,
    };
    return result;
  }
}
