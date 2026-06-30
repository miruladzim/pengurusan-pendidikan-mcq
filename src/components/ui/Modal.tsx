import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  description: ReactNode;
  onClose: () => void;
  actions: ReactNode;
}

export function Modal({ title, description, onClose, actions }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="animate-fade-in w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="modal-title" className="text-xl font-bold text-slate-900">
          {title}
        </h2>
        <div className="mt-2 text-slate-600 leading-relaxed">{description}</div>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">{actions}</div>
      </div>
    </div>
  );
}
