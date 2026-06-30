import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import type { ExamMode } from "../types/exam";
import { TOPICS } from "../data/topics";
import { loadAttemptHistory } from "../utils/history";

const SET_COLORS = [
  "from-blue-500 to-blue-600",
  "from-indigo-500 to-indigo-600",
  "from-violet-500 to-violet-600",
  "from-cyan-500 to-cyan-600",
  "from-teal-500 to-teal-600",
];

export function HomePage() {
  const [mode, setMode] = useState<ExamMode>("exam");
  const history = useMemo(() => loadAttemptHistory(), []);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <section className="card mb-8 overflow-hidden p-8 sm:p-10">
          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              Open University Malaysia
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Peperiksaan Mock MCQ
            </h1>
            <p className="mt-1 text-lg font-medium text-slate-600">HPGD2203 — Pengurusan Pendidikan</p>
            <p className="mt-4 max-w-2xl text-slate-600 leading-relaxed">
              Bersedia untuk peperiksaan sebenar dengan 5 set soalan berdasarkan modul kursus.
              Pilih mod peperiksaan atau latihan, kemudian mula mana-mana set.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="badge bg-brand-50 text-brand-700">200 soalan unik</span>
              <span className="badge bg-slate-100 text-slate-700">10 topik modul</span>
              <span className="badge bg-emerald-50 text-emerald-700">60 min / peperiksaan</span>
            </div>
          </div>
        </section>

        <section className="card mb-8 p-6">
          <h2 className="mb-1 text-lg font-bold text-slate-900">Pilih Mod</h2>
          <p className="mb-5 text-sm text-slate-500">Tentukan cara anda ingin berlatih</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                {
                  id: "exam" as const,
                  title: "Mod Peperiksaan",
                  desc: "Simulasi sebenar — 60 minit, tanpa maklum balas semasa ujian.",
                  icon: "⏱",
                },
                {
                  id: "practice" as const,
                  title: "Mod Latihan",
                  desc: "Maklum balas segera dan penjelasan selepas setiap jawapan.",
                  icon: "📖",
                },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={`rounded-xl border-2 p-5 text-left transition ${
                  mode === item.id
                    ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {item.icon}
                </span>
                <p className="mt-2 font-bold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Set Peperiksaan Mock</h2>
              <p className="text-sm text-slate-500">40 soalan setiap set • 4 soalan per topik</p>
            </div>
            <span className="badge bg-brand-100 text-brand-700">
              {mode === "exam" ? "Mod Peperiksaan" : "Mod Latihan"}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((setId) => (
              <Link
                key={setId}
                to={`/intro/${setId}/${mode}`}
                className="card card-interactive group block p-6 no-underline"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${SET_COLORS[setId - 1]} text-lg font-bold text-white shadow-sm`}
                >
                  {setId}
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-700">
                  Mock Exam {setId}
                </h3>
                <p className="mt-2 text-sm text-slate-600">40 soalan MCQ merangkumi semua topik modul.</p>
                <p className="mt-4 text-sm font-semibold text-brand-600">Mula set ini →</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="card mb-8 p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Topik Diliputi</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {TOPICS.map((topic) => (
              <div
                key={topic.id}
                className="flex items-start gap-3 rounded-lg bg-slate-50 px-3 py-2.5 text-sm"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-100 text-xs font-bold text-brand-700">
                  {topic.id}
                </span>
                <span className="text-slate-700">{topic.name}</span>
              </div>
            ))}
          </div>
        </section>

        {history.length > 0 && (
          <section className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Sejarah Percubaan Terkini</h2>
            <div className="space-y-2">
              {history.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm"
                >
                  <span className="font-medium text-slate-800">
                    Set {item.setId} · {item.mode === "exam" ? "Peperiksaan" : "Latihan"}
                  </span>
                  <span className="font-bold text-slate-900">
                    {item.score}/{item.total} ({item.percentage}%)
                  </span>
                  {item.passed === true && (
                    <span className="badge bg-emerald-100 text-emerald-800">Lulus</span>
                  )}
                  {item.passed === false && (
                    <span className="badge bg-red-100 text-red-800">Gagal</span>
                  )}
                  <span className="ml-auto text-slate-500">
                    {new Date(item.completedAt).toLocaleString("ms-MY")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
