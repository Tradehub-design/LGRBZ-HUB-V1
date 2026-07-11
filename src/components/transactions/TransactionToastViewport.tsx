"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RotateCcw,
  X,
  XCircle,
} from "lucide-react";
import { useEffect } from "react";
import {
  TransactionToast,
  TransactionToastTone,
} from "@/lib/transactions/transactionToast";

type Props = {
  toasts: TransactionToast[];
  onDismiss: (id: string) => void;
};

function toneClasses(tone: TransactionToastTone) {
  if (tone === "success") {
    return {
      border:
        "border-emerald-200 dark:border-emerald-900",
      iconBackground:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      icon: CheckCircle2,
    };
  }

  if (tone === "error") {
    return {
      border: "border-red-200 dark:border-red-900",
      iconBackground:
        "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      icon: XCircle,
    };
  }

  if (tone === "warning") {
    return {
      border:
        "border-amber-200 dark:border-amber-900",
      iconBackground:
        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      icon: AlertTriangle,
    };
  }

  return {
    border: "border-blue-200 dark:border-blue-900",
    iconBackground:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    icon: Info,
  };
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: TransactionToast;
  onDismiss: (id: string) => void;
}) {
  const classes = toneClasses(toast.tone);
  const Icon = classes.icon;

  useEffect(() => {
    if (!toast.duration || toast.duration <= 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration);

    return () => window.clearTimeout(timeout);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <article
      className={`pointer-events-auto rounded-2xl border bg-white p-4 shadow-2xl dark:bg-slate-950 ${classes.border}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 rounded-xl p-2 ${classes.iconBackground}`}
        >
          <Icon className="h-4 w-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
            {toast.title}
          </p>

          {toast.message && (
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {toast.message}
            </p>
          )}

          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                onDismiss(toast.id);
              }}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <RotateCcw className="h-4 w-4" />
              {toast.actionLabel}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export function TransactionToastViewport({
  toasts,
  onDismiss,
}: Props) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}
