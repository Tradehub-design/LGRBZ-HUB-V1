import { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold">
          {title}
        </h2>

        <p className="mt-3 text-sm text-slate-500">
          {description}
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-slate-200 px-4 py-2"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-xl bg-slate-950 px-4 py-2 text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
