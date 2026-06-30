import { Link } from "react-router-dom";

interface BackHomeLinkProps {
  className?: string;
  label?: string;
}

export function BackHomeLink({
  className = "",
  label = "Laman Utama",
}: BackHomeLinkProps) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-brand-600 ${className}`}
    >
      <span
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-base shadow-sm ring-1 ring-slate-200"
        aria-hidden="true"
      >
        ←
      </span>
      {label}
    </Link>
  );
}
