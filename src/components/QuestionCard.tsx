import type { OptionId, ShuffledQuestion } from "../types/exam";
import { formatCognitiveLevel, formatDifficulty } from "../utils/labels";

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
    <article className="card p-6 sm:p-8">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="badge bg-slate-900 text-white dark:bg-slate-700">
          Soalan {index + 1}/{total}
        </span>
        <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
          {question.topicName}
        </span>
        <span className="badge bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
          {formatDifficulty(question.difficulty)}
        </span>
        <span className="badge bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
          {formatCognitiveLevel(question.cognitiveLevel)}
        </span>
      </div>

      <p className="mb-8 text-lg leading-relaxed font-medium text-slate-900 sm:text-xl dark:text-white">
        {question.stem}
      </p>

      <fieldset className="space-y-3" disabled={disabled || showFeedback}>
        <legend className="sr-only">Pilihan jawapan</legend>
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === question.correctOptionId;

          let optionClass =
            "group flex w-full cursor-pointer items-start gap-4 rounded-xl border-2 px-4 py-4 text-left transition ";

          if (showFeedback) {
            if (isCorrect) {
              optionClass +=
                "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-200";
            } else if (isSelected) {
              optionClass +=
                "border-red-400 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-900/20 dark:text-red-200";
            } else {
              optionClass +=
                "border-slate-200 bg-slate-50 text-slate-500 opacity-70 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400";
            }
          } else if (isSelected) {
            optionClass +=
              "border-brand-500 bg-brand-50 text-brand-900 shadow-sm dark:bg-brand-900/20 dark:text-brand-100";
          } else {
            optionClass +=
              "border-slate-200 bg-white hover:border-brand-300 hover:bg-brand-50/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-brand-500/60 dark:hover:bg-slate-700/50";
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled || showFeedback}
              onClick={() => onSelect(option.id)}
              className={optionClass}
              aria-pressed={isSelected}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold transition ${
                  isSelected
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-slate-300 bg-white text-slate-600 group-hover:border-brand-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {option.id}
              </span>
              <span className="flex-1 pt-0.5 leading-relaxed">{option.text}</span>
              {showFeedback && isCorrect && (
                <span className="text-emerald-600 dark:text-emerald-400" aria-label="Jawapan betul">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </fieldset>
    </article>
  );
}
