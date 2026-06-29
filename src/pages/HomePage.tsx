import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { ExamMode } from "../types/exam";
import { loadAttemptHistory } from "../utils/history";

export function HomePage() {
  const [mode, setMode] = useState<ExamMode>("exam");
  const history = useMemo(() => loadAttemptHistory(), []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Open University Malaysia
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          HPGD2203 — Pengurusan Pendidikan
        </h1>
        <p className="mt-3 text-slate-600">
          Sistem Peperiksaan Mock MCQ berdasarkan modul kursus. Pilih set peperiksaan dan mod
          latihan anda.
        </p>
      </header>

      <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Mod Peperiksaan</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("exam")}
            className={`rounded-xl border p-4 text-left transition ${
              mode === "exam"
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <p className="font-semibold text-slate-900">Mod Peperiksaan</p>
            <p className="mt-1 text-sm text-slate-600">
              Simulasi peperiksaan sebenar dengan masa 60 minit, tanpa maklum balas semasa ujian.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setMode("practice")}
            className={`rounded-xl border p-4 text-left transition ${
              mode === "practice"
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <p className="font-semibold text-slate-900">Mod Latihan</p>
            <p className="mt-1 text-sm text-slate-600">
              Maklum balas segera selepas setiap jawapan untuk pembelajaran berterusan.
            </p>
          </button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Set Peperiksaan Mock</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((setId) => (
            <Link
              key={setId}
              to={`/intro/${setId}/${mode}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-400 hover:shadow-md"
            >
              <p className="text-sm font-medium text-blue-600">Set {setId}</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">Mock Exam {setId}</h3>
              <p className="mt-2 text-sm text-slate-600">40 soalan MCQ merangkumi 10 topik modul.</p>
            </Link>
          ))}
        </div>
      </section>

      {history.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Sejarah Percubaan Terkini</h2>
          <div className="space-y-3">
            {history.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm"
              >
                <span>
                  Set {item.setId} • {item.mode === "exam" ? "Peperiksaan" : "Latihan"}
                </span>
                <span className="font-semibold text-slate-800">
                  {item.score}/{item.total} ({item.percentage}%)
                  {item.passed === true && " • Lulus"}
                  {item.passed === false && " • Gagal"}
                </span>
                <span className="text-slate-500">
                  {new Date(item.completedAt).toLocaleString("ms-MY")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
