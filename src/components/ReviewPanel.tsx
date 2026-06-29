import type { ExamResult, OptionId } from "../types/exam";

interface ReviewPanelProps {
  result: ExamResult;
}

function getOptionText(
  question: ExamResult["questions"][number],
  optionId: OptionId | null
) {
  if (!optionId) return "Tidak dijawab";
  return (
    question.shuffledOptions.find((option) => option.id === optionId)?.text ??
    optionId
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
            className={`rounded-2xl border p-5 ${
              isUnanswered
                ? "border-slate-200 bg-slate-50"
                : isCorrect
                  ? "border-green-200 bg-green-50/40"
                  : "border-red-200 bg-red-50/40"
            }`}
          >
            <div className="mb-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white px-2 py-1 font-medium text-slate-700">
                Soalan {index + 1}
              </span>
              <span className="rounded-full bg-white px-2 py-1 text-slate-600">
                {question.topicName}
              </span>
              <span className="rounded-full bg-white px-2 py-1 capitalize text-slate-600">
                {question.difficulty}
              </span>
            </div>

            <p className="mb-4 font-medium text-slate-900">{question.stem}</p>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Jawapan anda: </span>
                {getOptionText(question, selected)}
              </p>
              <p>
                <span className="font-semibold">Jawapan betul: </span>
                {getOptionText(question, question.correctOptionId)}
              </p>
              <p className="rounded-lg bg-white/80 p-3 text-slate-700">
                <span className="font-semibold">Penjelasan: </span>
                {question.explanation}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
