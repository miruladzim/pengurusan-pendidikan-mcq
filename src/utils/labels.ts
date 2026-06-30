const DIFFICULTY_LABELS: Record<string, string> = {
  easy: "Mudah",
  moderate: "Sederhana",
  hard: "Sukar",
};

const COGNITIVE_LABELS: Record<string, string> = {
  recall: "Ingatan",
  understanding: "Kefahaman",
  application: "Aplikasi",
  analysis: "Analisis",
  "problem-solving": "Penyelesaian Masalah",
};

export function formatDifficulty(difficulty: string) {
  return DIFFICULTY_LABELS[difficulty] ?? difficulty;
}

export function formatCognitiveLevel(level: string) {
  return COGNITIVE_LABELS[level] ?? level;
}
