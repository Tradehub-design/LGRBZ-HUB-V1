"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  TransactionValidationErrors,
  TransactionValidationResult,
} from "@/lib/transactions/transactionValidation";

type Props = {
  result: TransactionValidationResult;
};

function humaniseFieldName(field: string) {
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (value) =>
      value.toUpperCase()
    );
}

export function TransactionValidationPanel({
  result,
}: Props) {
  const errorEntries = Object.entries(
    result.errors
  ) as Array<
    [
      keyof TransactionValidationErrors,
      string
    ]
  >;

  if (
    errorEntries.length === 0 &&
    result.warnings.length === 0
  ) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/70 dark:bg-emerald-950/30">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

          <div>
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              Transaction is valid
            </p>

            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
              No validation problems were detected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {errorEntries.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900/70 dark:bg-red-950/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                Fix the following errors
              </p>

              <ul className="mt-2 space-y-1.5">
                {errorEntries.map(
                  ([field, message]) => (
                    <li
                      key={String(field)}
                      className="text-xs text-red-700 dark:text-red-300"
                    >
                      <span className="font-semibold">
                        {humaniseFieldName(
                          String(field)
                        )}
                        :
                      </span>{" "}
                      {message}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {result.warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/70 dark:bg-amber-950/30">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />

            <div className="min-w-0">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Review before saving
              </p>

              <ul className="mt-2 space-y-1.5">
                {result.warnings.map(
                  (warning) => (
                    <li
                      key={warning}
                      className="text-xs text-amber-700 dark:text-amber-300"
                    >
                      {warning}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
