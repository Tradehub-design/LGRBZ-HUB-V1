"use client";

import {
  ArrowRight,
  FilePenLine,
} from "lucide-react";
import {
  formatMoney,
  formatNumber,
  NormalisedTransaction,
} from "@/lib/transactions/professionalTransactions";
import { getTransactionChangeSummary } from "@/lib/transactions/transactionValidation";

type Props = {
  original: NormalisedTransaction;
  draft: NormalisedTransaction;
};

type DisplayRow = {
  key: keyof NormalisedTransaction;
  label: string;
  before: string;
  after: string;
};

function formatValue(
  key: keyof NormalisedTransaction,
  value: unknown,
  currency = "AUD"
) {
  if (
    key === "price" ||
    key === "fees" ||
    key === "total"
  ) {
    return formatMoney(
      Number(value || 0),
      currency
    );
  }

  if (key === "quantity") {
    return formatNumber(
      Number(value || 0),
      4
    );
  }

  const text = String(value ?? "").trim();

  return text || "—";
}

export function TransactionChangeSummary({
  original,
  draft,
}: Props) {
  const changedLabels =
    getTransactionChangeSummary(
      original,
      draft
    );

  const rows: DisplayRow[] = [
    {
      key: "date",
      label: "Date",
      before: formatValue(
        "date",
        original.date
      ),
      after: formatValue(
        "date",
        draft.date
      ),
    },
    {
      key: "symbol",
      label: "Symbol",
      before: formatValue(
        "symbol",
        original.symbol
      ),
      after: formatValue(
        "symbol",
        draft.symbol
      ),
    },
    {
      key: "name",
      label: "Company name",
      before: formatValue(
        "name",
        original.name
      ),
      after: formatValue(
        "name",
        draft.name
      ),
    },
    {
      key: "type",
      label: "Type",
      before: formatValue(
        "type",
        original.type
      ),
      after: formatValue(
        "type",
        draft.type
      ),
    },
    {
      key: "quantity",
      label: "Quantity",
      before: formatValue(
        "quantity",
        original.quantity
      ),
      after: formatValue(
        "quantity",
        draft.quantity
      ),
    },
    {
      key: "price",
      label: "Price",
      before: formatValue(
        "price",
        original.price,
        original.currency
      ),
      after: formatValue(
        "price",
        draft.price,
        draft.currency
      ),
    },
    {
      key: "fees",
      label: "Fees",
      before: formatValue(
        "fees",
        original.fees,
        original.currency
      ),
      after: formatValue(
        "fees",
        draft.fees,
        draft.currency
      ),
    },
    {
      key: "total",
      label: "Total",
      before: formatValue(
        "total",
        original.total,
        original.currency
      ),
      after: formatValue(
        "total",
        draft.total,
        draft.currency
      ),
    },
    {
      key: "currency",
      label: "Currency",
      before: formatValue(
        "currency",
        original.currency
      ),
      after: formatValue(
        "currency",
        draft.currency
      ),
    },
    {
      key: "broker",
      label: "Broker",
      before: formatValue(
        "broker",
        original.broker
      ),
      after: formatValue(
        "broker",
        draft.broker
      ),
    },
    {
      key: "notes",
      label: "Notes",
      before: formatValue(
        "notes",
        original.notes
      ),
      after: formatValue(
        "notes",
        draft.notes
      ),
    },
  ].filter(
    (row) => row.before !== row.after
  );

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          No changes yet
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Update a field to review the change summary.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FilePenLine className="h-4 w-4 text-slate-500" />

          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
            Change summary
          </p>
        </div>

        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-sm dark:bg-slate-950 dark:text-slate-300">
          {changedLabels.length} field
          {changedLabels.length === 1
            ? ""
            : "s"}
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {rows.map((row) => (
          <div
            key={String(row.key)}
            className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {row.label}
            </p>

            <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <p className="break-words text-xs text-slate-500 line-through">
                {row.before}
              </p>

              <ArrowRight className="hidden h-4 w-4 text-slate-400 sm:block" />

              <p className="break-words text-xs font-semibold text-slate-900 dark:text-slate-100">
                {row.after}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
