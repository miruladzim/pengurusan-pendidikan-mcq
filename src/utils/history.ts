import type { AttemptHistory } from "../types/exam";

const HISTORY_KEY = "hpgd2203-attempt-history";

export function loadAttemptHistory(): AttemptHistory[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AttemptHistory[];
  } catch {
    return [];
  }
}

export function saveAttempt(record: AttemptHistory) {
  const history = loadAttemptHistory();
  history.unshift(record);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
}
