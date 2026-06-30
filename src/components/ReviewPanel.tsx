import type { ExamResult, OptionId } from "../types/exam";
import { formatDifficulty } from "../utils/labels";

interface ReviewPanelProps {
  result: ExamResult;
}

function getOptionText(
  question: ExamResult["questions"][number],
  optionId: OptionId | null
) {
  if (!optionId) return "Tidak dijawab";
  return (
    question.shuffledOptions.find((option) => option.id === optionId)?.text ?? optionId
  );
}

export function ReviewPanel({ result }: ReviewPanelProps) {
  return (
    <div className="space-y-4">
      {result.questions.map((question, index) => {
        const selected = result.answers[question.id] ?? null;
        const isCorrect = selected === question.correctOptionId;
        const isUnanswered = !selected;

        return (
          <div
            key={question.id}
            className={`card overflow-hidden ${
              isUnanswered
                ? "border-slate-200"
                : isCorrect
                  ? "border-emerald-200"
                  : "border-red-200"
            }`}
          >
            <div
              className={`flex flex-wrap items-center gap-2 px-5 py-3 text-xs ${
                isUnanswered
                  ? "bg-slate-50"
                  : isCorrect
                    ? "bg-emerald-50"
                    : "bg-red-50"
              }`}
            >
              <span className="font-bold text-slate-800">Soalan {index + 1}</span>
              <span className="badge bg-white text-slate-600">{question.topicName}</span>
              <span className="badge bg-white text-slate-600">
                {formatDifficulty(question.difficulty)}
              </span>
              <span
                className={`ml-auto font-bold ${
                  isUnanswered
                    ? "text-slate-500"
                    : isCorrect
                      ? "text-emerald-700"
                      : "text-red-700"
                }`}
              >
                {isUnanswered ? "Tidak dijawab" : isCorrect ? "Betul" : "Salah"}
              </span>
            </div>

            <div className="p-5">
              <p className="mb-4 font-medium leading-relaxed text-slate-900">{question.stem}</p>

              <div className="space-y-2 text-sm">
                <p className="rounded-lg bg-slate-50 px-3 py-2">
                  <span className="font-semibold text-slate-700">Jawapan anda: </span>
                  {getOptionText(question, selected)}
                </p>
                {!isCorrect && (
                  <p className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-900">
                    <span className="font-semibold">Jawapan betul: </span>
                    {getOptionText(question, question.correctOptionId)}
                  </p>
                )}
                <p className="rounded-lg border border-slate-100 bg-white px-3 py-2 text-slate-700">
                  <span className="font-semibold">Penjelasan: </span>
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
