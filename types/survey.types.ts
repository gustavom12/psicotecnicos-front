export enum FieldType {
  SHORT_TEXT = 'shortText',
  PARAGRAPH = 'paragraph',
  NUMBER = 'number',
  OPTIONS = 'options',
  FILE = 'file',
  SCALE = 'scale',
}

export interface Question {
  id?: string;
  type: FieldType;
  question: string;
  label?: string;
  options?: string[];
}

export interface Slide {
  index: number;
  title: string;
  html: string;
  comments?: string;
  professional: Question[];
  interviewer: Question[];
}

export interface Form {
  _id: string;
  teamId: string;
  title: string;
  category?: string;
  slides: Slide[];
}

export interface Module {
  order: number;
  id: string;
  name?: string;
  category?: string;
  description?: string;
}

export interface Survey {
  _id: string;
  name: string;
  teamId: string;
  title?: string;
  position: string;
  description: string;
  modules: Module[];
  previousEvaluations?: boolean;
  forms?: string[] | Form[]; // Mantener por compatibilidad
  duration?: number;
  status?: 'DRAFT' | 'NOT_STARTED' | 'FINISHED';
  createdAt: string;
  updatedAt: string;
}

export interface SlideTimeData {
  slideIndex: number;
  formId: string;
  startTime: Date;
  endTime?: Date;
  totalTimeSeconds: number;
  visitCount: number; // Cuántas veces visitó este slide
}

export interface InterviewResponse {
  questionId: string;
  slideIndex: number;
  formId: string;
  answer: string | number | string[] | File;
  questionType: FieldType;
}

export interface InterviewSubmission {
  interviewId?: string;
  surveyId: string;
  intervieweeId: string;
  moduleId?: string;
  responses: InterviewResponse[];
  slideTimeData: SlideTimeData[];
  totalInterviewTimeSeconds: number;
  completedAt: Date;
  startedAt: Date;
}
