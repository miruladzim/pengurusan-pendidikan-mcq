export type Language = "bm" | "en";

const STORAGE_KEY = "mcq-language";

type Listener = (language: Language) => void;
const listeners = new Set<Listener>();

export const SUBJECT_NAME: Record<Language, string> = {
  bm: "Pengurusan Pendidikan",
  en: "Educational Management (EM)",
};

export function getLanguage(): Language {
  return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "bm";
}

export function setLanguage(language: Language) {
  localStorage.setItem(STORAGE_KEY, language);
  listeners.forEach((listener) => listener(language));
}

export function subscribeLanguage(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
