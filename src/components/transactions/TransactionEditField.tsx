"use client";

import { ReactNode } from "react";

type Props = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
};

export function TransactionEditField({
  label,
  error,
  hint,
  required,
  children,
}: Props) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}

        {required && (
          <span
            className="text-red-500"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </span>

      {children}

      {error ? (
        <span className="block text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </span>
      ) : hint ? (
        <span className="block text-xs text-slate-500">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
