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
];

export function HomePage() {
  const [mode, setMode] = useState<ExamMode>("exam");
  const history = useMemo(() => loadAttemptHistory(), []);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <section className="card mb-8 overflow-hidden p-8 sm:p-10">
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Open University Malaysia
              </p>
              <span className="badge bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                Versi Percubaan (Percuma)
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Peperiksaan Mock MCQ
            </h1>
            <p className="mt-1 text-lg font-medium text-slate-600 dark:text-slate-400">
              HPGD2203 — Pengurusan Pendidikan
            </p>
            <p className="mt-4 max-w-2xl text-slate-600 leading-relaxed dark:text-slate-400">
              Bersedia untuk peperiksaan sebenar dengan 3 set soalan berdasarkan modul kursus.
              Pilih mod peperiksaan atau latihan, kemudian mula mana-mana set.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                200 soalan unik
              </span>
              <span className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                10 topik modul
              </span>
              <span className="badge bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                60 min / peperiksaan
              </span>
            </div>
          </div>
        </section>

        <section className="card mb-8 p-6">
          <h2 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">Pilih Mod</h2>
          <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
            Tentukan cara anda ingin berlatih
          </p>
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
                    ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20 dark:bg-brand-900/30"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600"
                }`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {item.icon}
                </span>
                <p className="mt-2 font-bold text-slate-900 dark:text-white">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed dark:text-slate-400">
                  {item.desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Set Peperiksaan Mock
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                40 soalan setiap set • 4 soalan per topik
              </p>
            </div>
            <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              {mode === "exam" ? "Mod Peperiksaan" : "Mod Latihan"}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((setId) => (
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
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-400">
                  Mock Exam {setId}
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  40 soalan MCQ merangkumi semua topik modul.
                </p>
                <p className="mt-4 text-sm font-semibold text-brand-600 dark:text-brand-400">
                  Mula set ini →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="card mb-8 p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">Topik Diliputi</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {TOPICS.map((topic) => (
              <div
                key={topic.id}
                className="flex items-start gap-3 rounded-lg bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-800/60"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                  {topic.id}
                </span>
                <span className="text-slate-700 dark:text-slate-300">{topic.name}</span>
              </div>
            ))}
          </div>
        </section>

        {history.length > 0 && (
          <section className="card p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
              Sejarah Percubaan Terkini
            </h2>
            <div className="space-y-2">
              {history.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-800/50"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Set {item.setId} · {item.mode === "exam" ? "Peperiksaan" : "Latihan"}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {item.score}/{item.total} ({item.percentage}%)
                  </span>
                  {item.passed === true && (
                    <span className="badge bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                      Lulus
                    </span>
                  )}
                  {item.passed === false && (
                    <span className="badge bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
                      Gagal
                    </span>
                  )}
                  <span className="ml-auto text-slate-500 dark:text-slate-400">
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
