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
  key: string;
}

export interface Subject {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
}

export interface CheckQuestionsRequest {
  answers: AnsweredQuestions[];
  time: number;
}

export interface AnsweredQuestions {
  questionId: string;
  correct?: string;
}

export interface CheckQuestionsResponse {
  message: string;
  correct: number;
  wrong: number;
  total: string;
  WrongQuestions: QuestionInfo[];
  CorrectQuestions: QuestionInfo[];
}

export interface QuestionInfo {
  QID: string;
  Question: string;
  inCorrectAnswer: string;
  correctAnswer: string;
  answers: {};
}

export interface ExamHistory {
  message: string;
  history: History;
}

export interface History {
  _id: string;
  checkAnswer: string;
  QID: {
    answers: Answers[];
    type: string;
    _id: string;
    question: string;
    correct: string;
    subject: Subject;
    exam: string;
    createdAt: string;
  };
  user: string;
  chosenAnswer: string;
  avgAnswerTime: string;
  createdAt: string;
}

export interface ExamById {
  message: string;
  exam: Exam;
}

export interface ExamScore {
  QID: string;
  Question: string;
  correct: string;
  selectedAnswer?: string;
  answers: Answers[];
}
