import type { ExamMode, ExamResult, OptionId, ShuffledQuestion } from "../types/exam";
import { PASS_THRESHOLD } from "../data/topics";

export function calculateScore(
  questions: ShuffledQuestion[],
  answers: Record<string, OptionId | null>
) {
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;

  for (const question of questions) {
    const selected = answers[question.id] ?? null;
    if (!selected) {
      unanswered++;
      continue;
    }
    if (selected === question.correctOptionId) {
      correct++;
    } else {
      incorrect++;
    }
  }

  const total = questions.length;
  const score = correct;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { correct, incorrect, unanswered, score, total, percentage };
}

export function buildExamResult(params: {
  setId: number;
  mode: ExamMode;
  questions: ShuffledQuestion[];
  answers: Record<string, OptionId | null>;
  startedAt: number;
  completedAt: number;
}): ExamResult {
  const { correct, incorrect, unanswered, score, total, percentage } =
    calculateScore(params.questions, params.answers);

  return {
    setId: params.setId,
    mode: params.mode,
    score,
    total,
    percentage,
    correct,
    incorrect,
    unanswered,
    passed: params.mode === "exam" ? percentage >= PASS_THRESHOLD : null,
    timeTakenMs: params.completedAt - params.startedAt,
    completedAt: params.completedAt,
    answers: params.answers,
    questions: params.questions,
  };
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatTimer(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
