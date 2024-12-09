import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExamEndpoint } from '../enums/exam-endpoints';
import { map, Observable } from 'rxjs';
import { AllSubjects, SubjectAdapted } from '../interfaces/subject';
import { SubjectAdapter } from '../adapter/subject.adapter';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  constructor(
    private _httpClient: HttpClient,
    private _subjectAdapter: SubjectAdapter
  ) {}

  getSubjectsWithLimit(
    page: number,
    limit: number
  ): Observable<SubjectAdapted> {
    return this._httpClient
      .get(`${ExamEndpoint.GET_ALL_SUBJECTS}page=${page}&limit=${limit}`)
      .pipe(
        map((res) => this._subjectAdapter.adaptSubject(res as AllSubjects))
      );
  }
}
