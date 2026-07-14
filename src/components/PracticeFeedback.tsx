import type { ShuffledQuestion } from "../types/exam";

interface PracticeFeedbackProps {
  question: ShuffledQuestion;
  isCorrect: boolean;
}

export function PracticeFeedback({ question, isCorrect }: PracticeFeedbackProps) {
  return (
    <div
      className={`animate-fade-in mt-4 rounded-xl border-l-4 p-5 ${
        isCorrect
          ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200"
          : "border-amber-500 bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200"
      }`}
      role="status"
    >
      <p className="flex items-center gap-2 font-bold">
        <span aria-hidden="true">{isCorrect ? "✓" : "✗"}</span>
        {isCorrect ? "Jawapan betul!" : "Jawapan tidak tepat"}
      </p>
      <p className="mt-2 text-sm leading-relaxed">{question.explanation}</p>
    </div>
  );
}
