import { Observable } from 'rxjs';
import { SubjectAdapted } from '../interfaces/subject';
import {
  CheckQuestionsRequest,
  CheckQuestionsResponse,
  ExamAdapted,
  ExamById,
  ExamHistory,
  ExamQuestions,
} from '../interfaces/exams';

export abstract class NgxAuthApi {
  abstract getSubjectsWithLimit(
    page: number,
    limit: number
  ): Observable<SubjectAdapted>;

  abstract getExamsOnSubject(
    subjectId: string,
    page: number,
    limit: number
  ): Observable<ExamAdapted>;

  abstract getQuestionsOnExam(examId: string): Observable<ExamQuestions>;

  abstract checkExamQuestions(
    data: CheckQuestionsRequest
  ): Observable<CheckQuestionsResponse>;

  abstract getExamHistory(): Observable<ExamHistory>;

  abstract getExamById(examId: string): Observable<ExamById>;
}
