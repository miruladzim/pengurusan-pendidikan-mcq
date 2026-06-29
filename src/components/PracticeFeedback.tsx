import type { ShuffledQuestion } from "../types/exam";

interface PracticeFeedbackProps {
  question: ShuffledQuestion;
  isCorrect: boolean;
}

export function PracticeFeedback({ question, isCorrect }: PracticeFeedbackProps) {
  return (
    <div
      className={`mt-4 rounded-xl border p-4 ${
        isCorrect
          ? "border-green-200 bg-green-50 text-green-900"
          : "border-amber-200 bg-amber-50 text-amber-900"
      }`}
    >
      <p className="mb-2 font-semibold">
        {isCorrect ? "Jawapan betul!" : "Jawapan tidak tepat."}
      </p>
      <p className="text-sm leading-relaxed">{question.explanation}</p>
    </div>
  );
}
