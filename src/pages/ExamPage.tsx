import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { PracticeFeedback } from "../components/PracticeFeedback";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionNavigator } from "../components/QuestionNavigator";
import { TimerBar } from "../components/TimerBar";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Modal } from "../components/ui/Modal";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { getExamSet } from "../data/examSets";
import { useBeforeUnloadWarning, useExamTimer } from "../hooks/useExamTimer";
import { useExamSession } from "../hooks/useExamSession";
import type { ExamMode, ExamResult, OptionId } from "../types/exam";
import { buildExamResult } from "../utils/scoring";

const OPTION_KEYS: Record<string, OptionId> = {
  a: "A",
  b: "B",
  c: "C",
  d: "D",
  "1": "A",
  "2": "B",
  "3": "C",
  "4": "D",
};

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

  const exitToHome = useCallback(() => {
    clearSession();
    navigate("/");
  }, [clearSession, navigate]);

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

  const isExam = session?.mode === "exam";
  const isLastQuestion =
    session != null && session.currentIndex === session.shuffledQuestions.length - 1;
  const selectedAnswer = currentQuestion ? (session?.answers[currentQuestion.id] ?? null) : null;
  const isCorrect = selectedAnswer === currentQuestion?.correctOptionId;
  const canProceedPractice =
    isPracticeFeedbackVisible && (isLastQuestion || selectedAnswer !== null);

  const handlePrimaryAction = useCallback(() => {
    if (!session) return;
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
  }, [
    session,
    isExam,
    isLastQuestion,
    isPracticeFeedbackVisible,
    nextQuestion,
    finishExam,
  ]);

  useEffect(() => {
    if (!session || !currentQuestion) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (showSubmitConfirm || showExitConfirm) return;

      const key = event.key.toLowerCase();

      if (key === "arrowleft" && session.currentIndex > 0) {
        event.preventDefault();
        previousQuestion();
        return;
      }

      if (key === "arrowright") {
        event.preventDefault();
        if (isExam) {
          if (isLastQuestion) setShowSubmitConfirm(true);
          else nextQuestion();
        } else if (canProceedPractice) {
          handlePrimaryAction();
        }
        return;
      }

      const option = OPTION_KEYS[key];
      if (option && !( !isExam && isPracticeFeedbackVisible)) {
        event.preventDefault();
        selectAnswer(option);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    session,
    currentQuestion,
    showSubmitConfirm,
    showExitConfirm,
    isExam,
    isLastQuestion,
    isPracticeFeedbackVisible,
    canProceedPractice,
    previousQuestion,
    nextQuestion,
    selectAnswer,
    handlePrimaryAction,
  ]);

  if (!setId || !mode || !["exam", "practice"].includes(mode) || questions.length === 0) {
    return <Navigate to="/" replace />;
  }

  if (!session || !currentQuestion) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950">
      <TimerBar formatted={formatted} isLow={isLow} visible={isExam} />

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="btn btn-secondary px-3 py-2 text-sm"
          >
            ← Keluar
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Set {session.setId}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isExam ? "Mod Peperiksaan" : "Mod Latihan"}
            </p>
          </div>
          {isExam ? (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(true)}
                className="btn btn-success px-3 py-2 text-sm"
              >
                Hantar
              </button>
            </div>
          ) : (
            <ThemeToggle />
          )}
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-5">
        <div className="mb-5">
          <ProgressBar
            value={answeredCount}
            max={session.shuffledQuestions.length}
            label={`Dijawab: ${answeredCount} / ${session.shuffledQuestions.length}`}
            showPercent
          />
          {!isExam && (
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              Soalan {session.currentIndex + 1} daripada {session.shuffledQuestions.length}
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
          <div className="animate-fade-in min-w-0">
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

            <p className="mt-4 hidden text-center text-xs text-slate-400 sm:block dark:text-slate-500">
              Pintasan: A–D atau 1–4 untuk jawapan · ← → untuk navigasi
            </p>
          </div>

          <QuestionNavigator
            total={session.shuffledQuestions.length}
            currentIndex={session.currentIndex}
            answers={session.answers}
            questionIds={session.questionOrder}
            onNavigate={goToQuestion}
          />
        </div>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:static sm:border-0 sm:bg-transparent sm:py-0 dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-6xl gap-3">
          <button
            type="button"
            onClick={previousQuestion}
            disabled={session.currentIndex === 0}
            className="btn btn-secondary flex-1 sm:flex-none"
          >
            ← Sebelumnya
          </button>
          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={!isExam && !canProceedPractice}
            className="btn btn-primary flex-1 sm:flex-none sm:min-w-[180px]"
          >
            {isExam
              ? isLastQuestion
                ? "Semak & Hantar"
                : "Seterusnya →"
              : isLastQuestion
                ? "Lihat Keputusan"
                : "Soalan Seterusnya →"}
          </button>
        </div>
      </div>

      <div className="h-4 sm:hidden" />

      {showExitConfirm && (
        <Modal
          title="Kembali ke Laman Utama?"
          description={
            isExam
              ? "Progres peperiksaan anda akan hilang dan masa akan ditamatkan."
              : "Progres latihan anda akan hilang jika anda keluar sekarang."
          }
          onClose={() => setShowExitConfirm(false)}
          actions={
            <>
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="btn btn-secondary flex-1"
              >
                Teruskan
              </button>
              <button type="button" onClick={exitToHome} className="btn btn-primary flex-1">
                Keluar
              </button>
            </>
          }
        />
      )}

      {showSubmitConfirm && (
        <Modal
          title="Hantar Peperiksaan?"
          description={
            <>
              Anda telah menjawab <strong>{answeredCount}</strong> daripada{" "}
              <strong>{session.shuffledQuestions.length}</strong> soalan. Pastikan anda bersedia
              untuk menghantar.
            </>
          }
          onClose={() => setShowSubmitConfirm(false)}
          actions={
            <>
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="btn btn-secondary flex-1"
              >
                Batal
              </button>
              <button type="button" onClick={finishExam} className="btn btn-success flex-1">
                Hantar Sekarang
              </button>
            </>
          }
        />
      )}
    </div>
  );
}
