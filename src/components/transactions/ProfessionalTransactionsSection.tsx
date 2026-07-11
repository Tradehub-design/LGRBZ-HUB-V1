"use client";

import {
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { ProfessionalLedgerTransactions } from "./ProfessionalLedgerTransactions";

type Props = {
  onAddTransaction?: () => void;
};

export function ProfessionalTransactionsSection({
  onAddTransaction,
}: Props) {
  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  return (
    <section className="space-y-5">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-slate-500" />

            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              LGRBZ Transaction Ledger
            </p>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
            Professional Transactions
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Search, review, edit and manage the portfolio transaction ledger. All changes continue through the existing ledger storage used by Holdings, Dashboard, Analytics, Tax and Performance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setRefreshKey(
                (current) =>
                  current + 1
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Ledger
          </button>

          <button
            type="button"
            onClick={
              onAddTransaction
            }
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </header>

      <ProfessionalLedgerTransactions
        key={refreshKey}
        onAddTransaction={
          onAddTransaction
        }
      />
    </section>
  );
}
