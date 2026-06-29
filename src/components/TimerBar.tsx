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
      className={`sticky top-0 z-20 border-b px-4 py-3 text-center text-lg font-semibold ${
        isLow
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-slate-200 bg-white text-slate-800"
      }`}
    >
      Masa Baki: {formatted || formatTimer(0)}
    </div>
  );
}
