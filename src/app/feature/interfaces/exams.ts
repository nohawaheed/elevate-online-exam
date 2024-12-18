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

export interface ExamQuestions {
  message: string;
  questions: Question[];
}

export interface Question {
  answers: Answers[];
  type: string;
  _id: string;
  question: string;
  correct: string;
  subject: Subject;
  exam: Exam;
  createdAt: string;
}

export interface Answers {
  answer: string;
  type: string;
}

export interface Subject {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
}
