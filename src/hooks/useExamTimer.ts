import { useEffect, useRef, useState } from "react";
import { EXAM_DURATION_MS } from "../data/topics";
import { formatTimer } from "../utils/scoring";

interface UseExamTimerOptions {
  enabled: boolean;
  startedAt: number;
  endAt: number | null;
  onExpire: () => void;
}

export function useExamTimer({
  enabled,
  startedAt,
  endAt,
  onExpire,
}: UseExamTimerOptions) {
  const [remainingMs, setRemainingMs] = useState(EXAM_DURATION_MS);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!enabled) return;

    const deadline = endAt ?? startedAt + EXAM_DURATION_MS;

    const tick = () => {
      const next = deadline - Date.now();
      setRemainingMs(Math.max(0, next));
      if (next <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current();
      }
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [enabled, startedAt, endAt]);

  return {
    remainingMs,
    formatted: formatTimer(remainingMs),
    isLow: remainingMs <= 5 * 60 * 1000,
    isExpired: remainingMs <= 0,
  };
}

export function useBeforeUnloadWarning(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [enabled]);
}
