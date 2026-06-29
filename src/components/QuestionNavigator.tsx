import type { OptionId } from "../types/exam";

interface QuestionNavigatorProps {
  total: number;
  currentIndex: number;
  answers: Record<string, OptionId | null>;
  questionIds: string[];
  onNavigate: (index: number) => void;
}

export function QuestionNavigator({
  total,
  currentIndex,
  answers,
  questionIds,
  onNavigate,
}: QuestionNavigatorProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Navigasi Soalan</h3>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
        {Array.from({ length: total }, (_, index) => {
          const questionId = questionIds[index];
          const answered = Boolean(questionId && answers[questionId]);
          const isCurrent = index === currentIndex;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onNavigate(index)}
              className={`h-10 rounded-lg text-sm font-medium transition ${
                isCurrent
                  ? "bg-blue-600 text-white"
                  : answered
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
