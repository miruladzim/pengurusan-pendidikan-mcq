import { Link, Navigate, useParams } from "react-router-dom";
import type { ExamMode } from "../types/exam";
import { BackHomeLink } from "../components/BackHomeLink";
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-4">
        <BackHomeLink />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-blue-600">Set Peperiksaan {parsedSetId}</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          {isExam ? "Mod Peperiksaan" : "Mod Latihan"}
        </h1>

        <ul className="mt-6 space-y-3 text-slate-700">
          <li>• Jumlah soalan: {QUESTIONS_PER_SET} MCQ</li>
          <li>• Liputan: 10 topik modul HPGD2203</li>
          {isExam ? (
            <>
              <li>• Masa peperiksaan: 60 minit</li>
              <li>• Tiada maklum balas sehingga penghantaran</li>
              <li>• Markah lulus: 60% (24/40)</li>
              <li>• Susunan soalan dan pilihan jawapan akan diacak</li>
            </>
          ) : (
            <>
              <li>• Tiada had masa</li>
              <li>• Maklum balas segera selepas setiap jawapan</li>
              <li>• Teruskan ke soalan seterusnya selepas semak penjelasan</li>
            </>
          )}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={`/exam/${parsedSetId}/${mode}`}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Mula
          </Link>
          <Link
            to="/"
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Kembali
          </Link>
        </div>
      </div>
    </div>
  );
}
