import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { BackHomeLink } from "../components/BackHomeLink";
import { ReviewPanel } from "../components/ReviewPanel";
import type { ExamResult } from "../types/exam";
import { PASS_THRESHOLD } from "../data/topics";
import { saveAttempt } from "../utils/history";
import { formatDuration } from "../utils/scoring";

function ScoreRing({ percentage, passed }: { percentage: number; passed: boolean | null }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const strokeColor =
    passed === null ? "#2563eb" : passed ? "#059669" : "#dc2626";

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900">{percentage}%</span>
        <span className="text-xs text-slate-500">markah</span>
      </div>
    </div>
  );
}

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
    <AppLayout maxWidth="4xl">
      <div className="animate-fade-in">
        <BackHomeLink className="mb-6" />

        <div className="card overflow-hidden">
          <div className="bg-gradient-to-br from-slate-50 to-brand-50 px-8 py-10 text-center">
            <p className="text-sm font-semibold text-brand-600">Keputusan Peperiksaan</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Set {result.setId} — {result.mode === "exam" ? "Mod Peperiksaan" : "Mod Latihan"}
            </h1>
            <div className="mt-6">
              <ScoreRing percentage={result.percentage} passed={result.passed} />
            </div>
            <p className="mt-4 text-lg font-semibold text-slate-800">
              {result.score} / {result.total} jawapan betul
            </p>
            {result.mode === "exam" && (
              <div
                className={`mt-4 inline-flex rounded-full px-5 py-2 text-sm font-bold ${
                  result.passed
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {result.passed ? "LULUS" : "GAGAL"} — Ambang {PASS_THRESHOLD}%
              </div>
            )}
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3">
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-700">{result.correct}</p>
              <p className="text-sm text-emerald-600">Betul</p>
            </div>
            <div className="rounded-xl bg-red-50 p-4 text-center">
              <p className="text-2xl font-bold text-red-700">{result.incorrect}</p>
              <p className="text-sm text-red-600">Salah</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4 text-center">
              <p className="text-2xl font-bold text-amber-700">
                {formatDuration(result.timeTakenMs)}
              </p>
              <p className="text-sm text-amber-600">Masa Diambil</p>
            </div>
          </div>

          {result.unanswered > 0 && (
            <p className="border-t border-slate-100 px-6 py-3 text-center text-sm text-slate-500">
              {result.unanswered} soalan tidak dijawab
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-3 border-t border-slate-100 p-6">
            <button
              type="button"
              onClick={() => setShowReview((value) => !value)}
              className="btn btn-primary"
            >
              {showReview ? "Sembunyikan Semakan" : "Semak Jawapan"}
            </button>
            <Link to="/" className="btn btn-secondary">
              Laman Utama
            </Link>
          </div>
        </div>

        {showReview && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-slate-900">Semakan Terperinci</h2>
            <ReviewPanel result={result} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
