import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { PracticeFeedback } from "../components/PracticeFeedback";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionNavigator } from "../components/QuestionNavigator";
import { TimerBar } from "../components/TimerBar";
import { getExamSet } from "../data/examSets";
import { useBeforeUnloadWarning, useExamTimer } from "../hooks/useExamTimer";
import { useExamSession } from "../hooks/useExamSession";
import type { ExamMode, ExamResult } from "../types/exam";
import { buildExamResult } from "../utils/scoring";

export function ExamPage() {
  const navigate = useNavigate();
  const { setId, mode } = useParams<{ setId: string; mode: ExamMode }>();
  const parsedSetId = Number(setId);
  const questions = useMemo(() => getExamSet(parsedSetId), [parsedSetId]);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const finishedRef = useRef(false);

  const {
    session,
    currentQuestion,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    markSubmitted,
    clearSession,
    answeredCount,
    isPracticeFeedbackVisible,
  } = useExamSession(parsedSetId, mode ?? "exam", questions);

  const finishExam = useCallback(() => {
    if (!session || finishedRef.current) return;
    finishedRef.current = true;
    markSubmitted();
    const result: ExamResult = buildExamResult({
      setId: session.setId,
      mode: session.mode,
      questions: session.shuffledQuestions,
      answers: session.answers,
      startedAt: session.startedAt,
      completedAt: Date.now(),
    });
    navigate("/results", { state: { result }, replace: true });
  }, [session, markSubmitted, navigate]);

  const { formatted, isLow } = useExamTimer({
    enabled: session?.mode === "exam" && !session.submitted,
    startedAt: session?.startedAt ?? Date.now(),
    endAt: session?.endAt ?? null,
    onExpire: finishExam,
  });

  useBeforeUnloadWarning(session?.mode === "exam" && !session.submitted);

  useEffect(() => {
    if (session?.submitted) {
      finishExam();
    }
  }, [session?.submitted, finishExam]);

  if (!setId || !mode || !["exam", "practice"].includes(mode) || questions.length === 0) {
    return <Navigate to="/" replace />;
  }

  if (!session || !currentQuestion) {
    return <Navigate to="/" replace />;
  }

  const isExam = session.mode === "exam";
  const isLastQuestion = session.currentIndex === session.shuffledQuestions.length - 1;
  const selectedAnswer = session.answers[currentQuestion.id] ?? null;
  const isCorrect = selectedAnswer === currentQuestion.correctOptionId;
  const canProceedPractice =
    isPracticeFeedbackVisible && (isLastQuestion || selectedAnswer !== null);

  const exitToHome = useCallback(() => {
    clearSession();
    navigate("/");
  }, [clearSession, navigate]);

  const handlePrimaryAction = () => {
    if (isExam) {
      if (isLastQuestion) {
        setShowSubmitConfirm(true);
      } else {
        nextQuestion();
      }
      return;
    }

    if (!isPracticeFeedbackVisible) return;
    if (isLastQuestion) {
      finishExam();
    } else {
      nextQuestion();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <TimerBar formatted={formatted} isLow={isLow} visible={isExam} />

      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
          >
            <span aria-hidden="true">←</span>
            Laman Utama
          </button>
          <p className="text-sm text-slate-500">
            Set {session.setId} • {isExam ? "Mod Peperiksaan" : "Mod Latihan"}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1">
              <p className="font-medium text-slate-800">
                Dijawab: {answeredCount}/{session.shuffledQuestions.length}
              </p>
              <div className="mt-2 h-2 w-full max-w-md overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${(answeredCount / session.shuffledQuestions.length) * 100}%`,
                  }}
                />
              </div>
              {!isExam && (
                <p className="mt-1 text-xs text-slate-500">
                  Soalan {session.currentIndex + 1} daripada {session.shuffledQuestions.length}
                </p>
              )}
            </div>
            {isExam && (
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(true)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Hantar Peperiksaan
              </button>
            )}
          </div>

          <QuestionCard
            question={currentQuestion}
            index={session.currentIndex}
            total={session.shuffledQuestions.length}
            selectedOptionId={selectedAnswer}
            onSelect={selectAnswer}
            showFeedback={!isExam && isPracticeFeedbackVisible}
            disabled={!isExam && isPracticeFeedbackVisible}
          />

          {!isExam && isPracticeFeedbackVisible && (
            <PracticeFeedback question={currentQuestion} isCorrect={isCorrect} />
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowExitConfirm(true)}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Keluar
            </button>
            <button
              type="button"
              onClick={previousQuestion}
              disabled={session.currentIndex === 0}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={handlePrimaryAction}
              disabled={!isExam && !canProceedPractice}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
            >
              {isExam
                ? isLastQuestion
                  ? "Semak & Hantar"
                  : "Seterusnya"
                : isLastQuestion
                  ? "Lihat Keputusan"
                  : "Soalan Seterusnya"}
            </button>
          </div>
        </div>

        <QuestionNavigator
          total={session.shuffledQuestions.length}
          currentIndex={session.currentIndex}
          answers={session.answers}
          questionIds={session.questionOrder}
          onNavigate={goToQuestion}
        />
      </div>

      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">Kembali ke Laman Utama?</h2>
            <p className="mt-2 text-slate-600">
              {isExam
                ? "Progres peperiksaan anda akan hilang dan masa akan ditamatkan."
                : "Progres latihan anda akan hilang jika anda keluar sekarang."}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700"
              >
                Teruskan
              </button>
              <button
                type="button"
                onClick={exitToHome}
                className="flex-1 rounded-xl bg-slate-800 px-4 py-2 font-semibold text-white"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">Hantar Peperiksaan?</h2>
            <p className="mt-2 text-slate-600">
              Anda telah menjawab {answeredCount} daripada {session.shuffledQuestions.length}{" "}
              soalan. Pastikan anda bersedia untuk menghantar.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={finishExam}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white"
              >
                Hantar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
