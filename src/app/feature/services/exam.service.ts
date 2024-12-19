import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExamEndpoint } from '../enums/exam-endpoints';
import { map, Observable } from 'rxjs';
import { AllSubjects, SubjectAdapted } from '../interfaces/subject';
import { SubjectAdapter } from '../adapter/subject.adapter';
import {
  AllExams,
  CheckQuestionsRequest,
  CheckQuestionsResponse,
  ExamAdapted,
  ExamHistory,
  ExamQuestions,
} from '../interfaces/exams';
import { ExamAdapter } from '../adapter/exam.adapter';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  constructor(
    private _httpClient: HttpClient,
    private _subjectAdapter: SubjectAdapter,
    private _examAdapter: ExamAdapter
  ) {}

  getSubjectsWithLimit(
    page: number,
    limit: number
  ): Observable<SubjectAdapted> {
    return this._httpClient
      .get(`${ExamEndpoint.GET_ALL_SUBJECTS}page=${page}&limit=${limit}`)
      .pipe(map((res) => this._subjectAdapter.adapt(res as AllSubjects)));
  }

  getExamsOnSubject(
    subjectId: string,
    page: number,
    limit: number
  ): Observable<ExamAdapted> {
    return this._httpClient
      .get(
        `${ExamEndpoint.GET_EXAMS_ON_SUBJECT}${subjectId}&page=${page}&limit=${limit}`
      )
      .pipe(map((res) => this._examAdapter.adapt(res as AllExams)));
  }

  getQuestionsOnExam(examId: string): Observable<ExamQuestions> {
    return this._httpClient
      .get(`${ExamEndpoint.GET_ALL_EXAM_QUESTIONS}${examId}`)
      .pipe(map((res) => res as ExamQuestions));
  }

  checkExamQuestions(
    data: CheckQuestionsRequest
  ): Observable<CheckQuestionsResponse> {
    return this._httpClient
      .post(`${ExamEndpoint.CHECK_QUESTIONS}`, data)
      .pipe(map((res) => res as CheckQuestionsResponse));
  }

  getExamHistory(): Observable<ExamHistory> {
    return this._httpClient
      .get(`${ExamEndpoint.GET_EXAM_HISTORY}`)
      .pipe(map((res) => res as ExamHistory));
  }
}
