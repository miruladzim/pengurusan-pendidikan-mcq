import { Link, Navigate, useParams } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { BackHomeLink } from "../components/BackHomeLink";
import type { ExamMode } from "../types/exam";
import { getExamSet } from "../data/examSets";
import { QUESTIONS_PER_SET } from "../data/topics";

export function ExamIntroPage() {
  const { setId, mode } = useParams<{ setId: string; mode: ExamMode }>();
  const parsedSetId = Number(setId);
  const questions = getExamSet(parsedSetId);

  if (!setId || !mode || !["exam", "practice"].includes(mode) || questions.length === 0) {
    return <Navigate to="/" replace />;
  }

  const isExam = mode === "exam";

  const rules = isExam
    ? [
        { icon: "📝", text: `${QUESTIONS_PER_SET} soalan MCQ` },
        { icon: "📚", text: "Liputan 10 topik modul HPGD2203" },
        { icon: "⏱", text: "Masa peperiksaan: 60 minit" },
        { icon: "🔇", text: "Tiada maklum balas sehingga penghantaran" },
        { icon: "✅", text: "Markah lulus: 60% (24/40)" },
        { icon: "🔀", text: "Soalan dan pilihan jawapan diacak" },
      ]
    : [
        { icon: "📝", text: `${QUESTIONS_PER_SET} soalan MCQ` },
        { icon: "📚", text: "Liputan 10 topik modul HPGD2203" },
        { icon: "♾", text: "Tiada had masa" },
        { icon: "💡", text: "Maklum balas segera selepas setiap jawapan" },
        { icon: "📖", text: "Semak penjelasan sebelum soalan seterusnya" },
      ];

  return (
    <AppLayout maxWidth="3xl">
      <div className="animate-fade-in">
        <BackHomeLink className="mb-6" />

        <div className="card overflow-hidden">
          <div
            className={`px-8 py-6 ${isExam ? "bg-gradient-to-r from-brand-600 to-brand-700" : "bg-gradient-to-r from-emerald-600 to-teal-600"} text-white`}
          >
            <p className="text-sm font-medium text-white/80">Set Peperiksaan {parsedSetId}</p>
            <h1 className="mt-1 text-3xl font-bold">{isExam ? "Mod Peperiksaan" : "Mod Latihan"}</h1>
          </div>

          <div className="p-8">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Maklumat Peperiksaan
            </h2>
            <ul className="space-y-3">
              {rules.map((rule) => (
                <li key={rule.text} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <span className="text-lg" aria-hidden="true">
                    {rule.icon}
                  </span>
                  <span className="pt-0.5">{rule.text}</span>
                </li>
              ))}
            </ul>

            {isExam && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
                <strong>Penting:</strong> Pemasa 60 minit bermula sebaik sahaja anda menekan Mula.
                Peperiksaan akan dihantar secara automatik apabila masa tamat.
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={`/exam/${parsedSetId}/${mode}`} className="btn btn-primary px-8 py-3 text-base">
                Mula Sekarang
              </Link>
              <Link to="/" className="btn btn-secondary px-8 py-3 text-base">
                Kembali
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
