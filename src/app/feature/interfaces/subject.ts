export interface AllSubjects {
  message: string;
  metadata: {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage: number;
  };
  subjects: Subject[];
}
export interface Subject {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
}

export interface SubjectAdapted {
  message: string;
  metadata: {
    currentPage: number;
    numberOfPages: number;
  };
  subjects: Subject[];
}
