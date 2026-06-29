import { useCallback, useMemo, useState } from "react";
import type {
  ExamMode,
  ExamSessionState,
  OptionId,
  Question,
  ShuffledQuestion,
} from "../types/exam";
import { EXAM_DURATION_MS } from "../data/topics";
import { shuffleArray } from "../utils/shuffle";

const SESSION_KEY = "hpgd2203-exam-session";

function shuffleQuestions(questions: Question[]): ShuffledQuestion[] {
  return questions.map((question) => ({
    ...question,
    shuffledOptions: shuffleArray(question.options),
  }));
}

function createSession(
  setId: number,
  mode: ExamMode,
  questions: Question[]
): ExamSessionState {
  const shuffled = shuffleQuestions(shuffleArray(questions));
  const answers = Object.fromEntries(
    shuffled.map((q) => [q.id, null])
  ) as Record<string, OptionId | null>;

  const now = Date.now();
  return {
    setId,
    mode,
    questionOrder: shuffled.map((q) => q.id),
    shuffledQuestions: shuffled,
    answers,
    currentIndex: 0,
    startedAt: now,
    endAt: mode === "exam" ? now + EXAM_DURATION_MS : null,
    submitted: false,
    practiceFeedbackShown: {},
  };
}

function loadStoredSession(): ExamSessionState | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ExamSessionState;
    if (parsed.submitted) return null;
    if (parsed.mode === "exam" && parsed.endAt && Date.now() > parsed.endAt) {
      return { ...parsed, submitted: true };
    }
    return parsed;
  } catch {
    return null;
  }
}

function persistSession(session: ExamSessionState | null) {
  if (!session || session.submitted) {
    sessionStorage.removeItem(SESSION_KEY);
    return;
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function useExamSession(setId: number, mode: ExamMode, questions: Question[]) {
  const [session, setSession] = useState<ExamSessionState | null>(() => {
    const stored = loadStoredSession();
    if (stored && stored.setId === setId && stored.mode === mode) {
      return stored;
    }
    return createSession(setId, mode, questions);
  });

  const updateSession = useCallback((updater: (prev: ExamSessionState) => ExamSessionState) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = updater(prev);
      persistSession(next);
      return next;
    });
  }, []);

  const currentQuestion = useMemo(() => {
    if (!session) return null;
    return session.shuffledQuestions[session.currentIndex] ?? null;
  }, [session]);

  const selectAnswer = useCallback(
    (optionId: OptionId) => {
      if (!session || session.submitted) return;
      const question = session.shuffledQuestions[session.currentIndex];
      if (!question) return;

      updateSession((prev) => ({
        ...prev,
        answers: { ...prev.answers, [question.id]: optionId },
        practiceFeedbackShown:
          prev.mode === "practice"
            ? { ...prev.practiceFeedbackShown, [question.id]: true }
            : prev.practiceFeedbackShown,
      }));
    },
    [session, updateSession]
  );

  const goToQuestion = useCallback(
    (index: number) => {
      updateSession((prev) => ({
        ...prev,
        currentIndex: Math.max(0, Math.min(index, prev.shuffledQuestions.length - 1)),
      }));
    },
    [updateSession]
  );

  const nextQuestion = useCallback(() => {
    updateSession((prev) => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, prev.shuffledQuestions.length - 1),
    }));
  }, [updateSession]);

  const previousQuestion = useCallback(() => {
    updateSession((prev) => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0),
    }));
  }, [updateSession]);

  const markSubmitted = useCallback(() => {
    updateSession((prev) => ({ ...prev, submitted: true }));
    sessionStorage.removeItem(SESSION_KEY);
  }, [updateSession]);

  const resetSession = useCallback(() => {
    const fresh = createSession(setId, mode, questions);
    persistSession(fresh);
    setSession(fresh);
  }, [setId, mode, questions]);

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  const answeredCount = useMemo(() => {
    if (!session) return 0;
    return Object.values(session.answers).filter(Boolean).length;
  }, [session]);

  const isPracticeFeedbackVisible = useMemo(() => {
    if (!session || !currentQuestion) return false;
    return Boolean(session.practiceFeedbackShown[currentQuestion.id]);
  }, [session, currentQuestion]);

  return {
    session,
    currentQuestion,
    selectAnswer,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    markSubmitted,
    resetSession,
    clearSession,
    answeredCount,
    isPracticeFeedbackVisible,
  };
}
