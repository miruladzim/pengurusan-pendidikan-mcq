import { useLanguage } from "../../hooks/useLanguage";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const isEn = language === "en";

  return (
    <div
      className={`flex items-center rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-bold shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}
      role="group"
      aria-label="Pilih bahasa"
    >
      <button
        type="button"
        onClick={() => setLanguage("bm")}
        aria-pressed={!isEn}
        className={`rounded-md px-2 py-1 transition ${
          !isEn
            ? "bg-brand-600 text-white"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        BM
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={isEn}
        className={`rounded-md px-2 py-1 transition ${
          isEn
            ? "bg-brand-600 text-white"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        ENG
      </button>
    </div>
  );
}
