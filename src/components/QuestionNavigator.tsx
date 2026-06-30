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
  const answered = questionIds.filter((id) => answers[id]).length;
  const unanswered = total - answered;

  return (
    <aside className="card p-4 lg:sticky lg:top-4 lg:self-start">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">Navigasi</h3>
        <span className="text-xs text-slate-500">
          {answered}/{total}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-5 gap-1.5 sm:grid-cols-8 lg:grid-cols-5">
        {Array.from({ length: total }, (_, index) => {
          const questionId = questionIds[index];
          const isAnswered = Boolean(questionId && answers[questionId]);
          const isCurrent = index === currentIndex;

          return (
            <button
              key={index}
              type="button"
              onClick={() => onNavigate(index)}
              aria-label={`Soalan ${index + 1}${isAnswered ? ", dijawab" : ", belum dijawab"}`}
              aria-current={isCurrent ? "true" : undefined}
              className={`flex h-9 items-center justify-center rounded-lg text-xs font-bold transition ${
                isCurrent
                  ? "bg-brand-600 text-white shadow-md ring-2 ring-brand-300"
                  : isAnswered
                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-brand-600" />
          Semasa
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-emerald-100 ring-1 ring-emerald-300" />
          Dijawab ({answered})
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-slate-100 ring-1 ring-slate-300" />
          Belum ({unanswered})
        </div>
      </div>
    </aside>
  );
}
