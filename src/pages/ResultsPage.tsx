import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { BackHomeLink } from "../components/BackHomeLink";
import { ReviewPanel } from "../components/ReviewPanel";
import type { ExamResult } from "../types/exam";
import { saveAttempt } from "../utils/history";
import { formatDuration } from "../utils/scoring";

export function ResultsPage() {
  const location = useLocation();
  const result = location.state?.result as ExamResult | undefined;
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    if (!result) return;
    saveAttempt({
      id: `${result.setId}-${result.completedAt}`,
      setId: result.setId,
      mode: result.mode,
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      passed: result.passed,
      completedAt: result.completedAt,
    });
  }, [result]);

  if (!result) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-4">
        <BackHomeLink />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-blue-600">Keputusan Peperiksaan</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Set {result.setId} — {result.mode === "exam" ? "Mod Peperiksaan" : "Mod Latihan"}
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Markah</p>
            <p className="text-2xl font-bold text-slate-900">
              {result.score}/{result.total} ({result.percentage}%)
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700">Betul</p>
            <p className="text-2xl font-bold text-emerald-900">{result.correct}</p>
          </div>
          <div className="rounded-xl bg-red-50 p-4">
            <p className="text-sm text-red-700">Salah</p>
            <p className="text-2xl font-bold text-red-900">{result.incorrect}</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-sm text-amber-700">Masa Diambil</p>
            <p className="text-2xl font-bold text-amber-900">
              {formatDuration(result.timeTakenMs)}
            </p>
          </div>
        </div>

        {result.mode === "exam" && (
          <div
            className={`mt-6 rounded-xl px-4 py-3 text-center text-lg font-semibold ${
              result.passed
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {result.passed ? "LULUS" : "GAGAL"} — Ambang lulus 60%
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setShowReview((value) => !value)}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {showReview ? "Sembunyikan Semakan" : "Semak Jawapan"}
          </button>
          <Link
            to="/"
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Kembali ke Laman Utama
          </Link>
        </div>
      </div>

      {showReview && (
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Semakan Terperinci</h2>
          <ReviewPanel result={result} />
        </div>
      )}
    </div>
  );
}
