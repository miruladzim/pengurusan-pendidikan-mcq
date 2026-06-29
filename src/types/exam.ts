export type OptionId = "A" | "B" | "C" | "D";
export type Difficulty = "easy" | "moderate" | "hard";
export type CognitiveLevel =
  | "recall"
  | "understanding"
  | "application"
  | "analysis"
  | "problem-solving";
export type ExamMode = "exam" | "practice";

export interface QuestionOption {
  id: OptionId;
  text: string;
}

export interface Question {
  id: string;
  topicId: number;
  topicName: string;
  difficulty: Difficulty;
  cognitiveLevel: CognitiveLevel;
  stem: string;
  options: QuestionOption[];
  correctOptionId: OptionId;
  explanation: string;
  moduleRef: string;
}

export interface ShuffledQuestion extends Question {
  shuffledOptions: QuestionOption[];
}

export interface ExamSessionState {
  setId: number;
  mode: ExamMode;
  questionOrder: string[];
  shuffledQuestions: ShuffledQuestion[];
  answers: Record<string, OptionId | null>;
  currentIndex: number;
  startedAt: number;
  endAt: number | null;
  submitted: boolean;
  practiceFeedbackShown: Record<string, boolean>;
}

export interface ExamResult {
  setId: number;
  mode: ExamMode;
  score: number;
  total: number;
  percentage: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  passed: boolean | null;
  timeTakenMs: number;
  completedAt: number;
  answers: Record<string, OptionId | null>;
  questions: ShuffledQuestion[];
}

export interface AttemptHistory {
  id: string;
  setId: number;
  mode: ExamMode;
  score: number;
  total: number;
  percentage: number;
  passed: boolean | null;
  completedAt: number;
}
