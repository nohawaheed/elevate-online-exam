import { Injectable } from '@angular/core';
import { Adapter } from '../../../components/business/interfaces/adapter';
import {
  AllSubjects,
  SubjectAdapted,
} from '../../../components/business/interfaces/subject';

@Injectable({
  providedIn: 'root',
})
export class SubjectAdapter implements Adapter {
  constructor() {}
  adapt(data: AllSubjects): SubjectAdapted {
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
