import { Injectable } from '@angular/core';
import { Adapter } from './../interfaces/adapter';
import { AllExams, ExamAdapted } from '../interfaces/exams';

@Injectable({
  providedIn: 'root',
})
export class ExamAdapter implements Adapter {
  constructor() {}
  adapt(data: AllExams): ExamAdapted {
    let result = {
      message: data.message,
      metadata: {
        currentPage: data.metadata.currentPage,
        numberOfPages: data.metadata.numberOfPages,
        prevPage: data.metadata.prevPage,
      },
      exams: data.exams,
    };
    return result;
  }
}
