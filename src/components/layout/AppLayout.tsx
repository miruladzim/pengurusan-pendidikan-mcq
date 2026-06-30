import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AppLayoutProps {
  children: ReactNode;
  maxWidth?: "3xl" | "4xl" | "5xl" | "6xl" | "full";
  showHeader?: boolean;
  className?: string;
}

const maxWidthClass = {
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  full: "max-w-full",
};

export function AppLayout({
  children,
  maxWidth = "5xl",
  showHeader = true,
  className = "",
}: AppLayoutProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      {showHeader && (
        <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
          <div className={`mx-auto flex items-center justify-between gap-4 px-4 py-3 ${maxWidthClass["6xl"]}`}>
            <Link to="/" className="group flex items-center gap-3 no-underline">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white shadow-sm transition group-hover:bg-brand-700">
                MCQ
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">HPGD2203</p>
                <p className="text-xs text-slate-500">Pengurusan Pendidikan</p>
              </div>
            </Link>
            <p className="hidden text-xs font-medium text-slate-500 sm:block">Open University Malaysia</p>
          </div>
        </header>
      )}
      <main className={`mx-auto px-4 py-8 sm:py-10 ${maxWidthClass[maxWidth]}`}>
        {children}
      </main>
      {showHeader && (
        <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
          Sistem Peperiksaan Mock MCQ — untuk tujuan pembelajaran sahaja
        </footer>
      )}
    </div>
  );
}
