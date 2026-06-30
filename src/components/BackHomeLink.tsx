import { Link } from "react-router-dom";

interface BackHomeLinkProps {
  className?: string;
  label?: string;
}

export function BackHomeLink({
  className,
  label = "Laman Utama",
}: BackHomeLinkProps) {
  return (
    <Link
      to="/"
      className={
        className ??
        "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
      }
    >
      <span aria-hidden="true">←</span>
      {label}
    </Link>
  );
}
