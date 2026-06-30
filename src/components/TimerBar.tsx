import { formatTimer } from "../utils/scoring";

interface TimerBarProps {
  formatted: string;
  isLow: boolean;
  visible: boolean;
}

export function TimerBar({ formatted, isLow, visible }: TimerBarProps) {
  if (!visible) return null;

  return (
    <div
      className={`flex items-center justify-center gap-2 border-b px-4 py-2.5 text-center font-mono text-base font-bold tracking-wide ${
        isLow
          ? "animate-pulse-soft border-red-300 bg-red-600 text-white"
          : "border-brand-200 bg-brand-600 text-white"
      }`}
      role="timer"
      aria-live="polite"
      aria-label={`Masa baki ${formatted}`}
    >
      <span aria-hidden="true">⏱</span>
      <span>Masa Baki: {formatted || formatTimer(0)}</span>
    </div>
  );
}
