import type { OptionId, ShuffledQuestion } from "../types/exam";

interface QuestionCardProps {
  question: ShuffledQuestion;
  index: number;
  total: number;
  selectedOptionId: OptionId | null;
  onSelect: (optionId: OptionId) => void;
  showFeedback?: boolean;
  disabled?: boolean;
}

export function QuestionCard({
  question,
  index,
  total,
  selectedOptionId,
  onSelect,
  showFeedback = false,
  disabled = false,
}: QuestionCardProps) {
  const options = question.shuffledOptions;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
          Soalan {index + 1} / {total}
        </span>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
          {question.topicName}
        </span>
        <span className="rounded-full bg-amber-50 px-3 py-1 capitalize text-amber-700">
          {question.difficulty}
        </span>
      </div>

      <p className="mb-6 text-lg leading-relaxed text-slate-900">{question.stem}</p>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === question.correctOptionId;
          let className =
            "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition";

          if (showFeedback) {
            if (isCorrect) {
              className += " border-green-300 bg-green-50 text-green-900";
            } else if (isSelected) {
              className += " border-red-300 bg-red-50 text-red-900";
            } else {
              className += " border-slate-200 bg-slate-50 text-slate-600";
            }
          } else if (isSelected) {
            className += " border-blue-500 bg-blue-50 text-blue-900";
          } else {
            className += " border-slate-200 hover:border-blue-300 hover:bg-slate-50";
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled || showFeedback}
              onClick={() => onSelect(option.id)}
              className={className}
            >
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-sm font-semibold">
                {option.id}
              </span>
              <span className="flex-1">{option.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
