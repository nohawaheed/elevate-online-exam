export interface AllExams {
  message: string;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    prevPage: number;
  };
  exams: Exam[];
}

export interface Exam {
  _id: string;
  title: string;
  duration: number;
  subject: string;
  numberOfQuestions: number;
  active: boolean;
  createdAt: string;
}

export interface ExamAdapted {
  message: string;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    prevPage: number;
  };
  exams: Exam[];
}
