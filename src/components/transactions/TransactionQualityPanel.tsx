"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Info,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  NormalisedTransaction,
} from "@/lib/transactions/professionalTransactions";
import {
  analyseTransactionQuality,
  TransactionQualityIssue,
} from "@/lib/transactions/transactionQuality";

type Props = {
  open: boolean;
  transactions: NormalisedTransaction[];
  onClose: () => void;
  onOpenTransaction?: (
    transactionId: string
  ) => void;
};

function issueIcon(
  issue: TransactionQualityIssue
) {
  if (issue.severity === "error") {
    return CircleAlert;
  }

  if (issue.severity === "warning") {
    return AlertTriangle;
  }

  return Info;
}

function issueClasses(
  issue: TransactionQualityIssue
) {
  if (issue.severity === "error") {
    return {
      wrapper:
        "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
      icon:
        "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      text:
        "text-red-900 dark:text-red-100",
    };
  }

  if (issue.severity === "warning") {
    return {
      wrapper:
        "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
      icon:
        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      text:
        "text-amber-900 dark:text-amber-100",
    };
  }

  return {
    wrapper:
      "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",
    icon:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    text:
      "text-blue-900 dark:text-blue-100",
  };
}

export function TransactionQualityPanel({
  open,
  transactions,
  onClose,
  onOpenTransaction,
}: Props) {
  if (!open) return null;

  const quality =
    analyseTransactionQuality(transactions);

  const scoreTone =
    quality.score >= 90
      ? "text-emerald-600 dark:text-emerald-400"
      : quality.score >= 70
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close transaction quality panel"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-500" />

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ledger Quality
              </p>
            </div>

            <h2 className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
              Transaction data health
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Detect invalid rows, duplicates and incomplete transaction metadata.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-auto p-5">
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Quality Score
              </p>

              <p className={`mt-2 text-3xl font-bold ${scoreTone}`}>
                {quality.score}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Out of 100
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Valid
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {quality.validTransactions}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Transactions
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Invalid
              </p>

              <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
                {quality.invalidTransactions}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Require attention
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Duplicates
              </p>

              <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
                {quality.duplicateTransactions}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Possible matches
              </p>
            </article>
          </section>

          <section className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
              Quality breakdown
            </h3>

            <dl className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 dark:bg-slate-950">
                <dt className="text-xs text-slate-500">
                  Missing broker
                </dt>
                <dd className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {quality.missingBrokerTransactions}
                </dd>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 dark:bg-slate-950">
                <dt className="text-xs text-slate-500">
                  Zero-value rows
                </dt>
                <dd className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {quality.zeroValueTransactions}
                </dd>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 dark:bg-slate-950">
                <dt className="text-xs text-slate-500">
                  Future dates
                </dt>
                <dd className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {quality.futureTransactions}
                </dd>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 dark:bg-slate-950">
                <dt className="text-xs text-slate-500">
                  Historic rows
                </dt>
                <dd className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {quality.staleTransactions}
                </dd>
              </div>
            </dl>
          </section>

          <section className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                Detected issues
              </h3>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {quality.issues.length}
              </span>
            </div>

            {quality.issues.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 dark:text-emerald-400" />

                  <div>
                    <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                      No data-quality issues detected
                    </p>

                    <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                      The transaction ledger passed all current quality checks.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {quality.issues.map((issue) => {
                  const Icon =
                    issueIcon(issue);
                  const classes =
                    issueClasses(issue);

                  return (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() =>
                        onOpenTransaction?.(
                          issue.transactionId
                        )
                      }
                      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition hover:shadow-sm ${classes.wrapper}`}
                    >
                      <span className={`rounded-xl p-2 ${classes.icon}`}>
                        <Icon className="h-4 w-4" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold ${classes.text}`}>
                          {issue.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                          {issue.message}
                        </p>

                        <p className="mt-2 text-[11px] font-medium text-slate-500">
                          {issue.symbol || "Unknown symbol"} ·{" "}
                          {issue.date || "No date"}
                        </p>
                      </div>

                      {onOpenTransaction && (
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}
