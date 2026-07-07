"use client";

import { useMemo, useState } from "react";
import { buildPortfolio } from "@/lib/portfolio-engine/buildPortfolio";
import { usePortfolioStore } from "@/store/portfolioStore";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatDate(value: string | null) {
  if (!value) return "Not loaded";

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function TransactionsPage() {
  const {
    loaded,
    lastUpdatedAt,
    rawLedgerCsv,
    transactions,
    holdings,
    dividends,
    cashAccounts,
    engine,
    setRawLedgerCsv,
    setEngine,
    clear,
  } = usePortfolioStore();

  const [draftCsv, setDraftCsv] = useState(rawLedgerCsv);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    return {
      transactions: transactions.length,
      holdings: holdings.filter((holding) => holding.status === "Open").length,
      dividends: dividends.reduce((sum, item) => sum + item.amountAud, 0),
      cash: cashAccounts.reduce((sum, item) => sum + item.balanceAud, 0),
      cost: engine?.summary.totalCostAud ?? 0,
      fees: engine?.summary.feesAud ?? 0,
    };
  }, [transactions, holdings, dividends, cashAccounts, engine]);

  function handleBuildPortfolio() {
    try {
      setError(null);

      if (!draftCsv.trim()) {
        setError("Paste your transaction CSV data first.");
        return;
      }

      const result = buildPortfolio(draftCsv);

      setRawLedgerCsv(draftCsv);
      setEngine(result, draftCsv);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process transactions.");
    }
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-400">
              Transaction Ledger
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
              Portfolio transactions
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Paste or update your transaction ledger here. This becomes the source of truth for
              holdings, cash, dividends, performance, tax, and dashboard summaries.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
            <p className="text-slate-500">Last updated</p>
            <p className="font-medium text-white">{formatDate(lastUpdatedAt)}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <MetricCard label="Transactions" value={String(totals.transactions)} />
        <MetricCard label="Open holdings" value={String(totals.holdings)} />
        <MetricCard label="Cash" value={formatCurrency(totals.cash)} />
        <MetricCard label="Invested cost" value={formatCurrency(totals.cost)} />
        <MetricCard label="Dividends" value={formatCurrency(totals.dividends)} />
        <MetricCard label="Fees" value={formatCurrency(totals.fees)} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Import / update ledger</h2>
              <p className="mt-1 text-sm text-slate-400">
                Paste CSV data from your transaction master file.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleBuildPortfolio}
                className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Update portfolio
              </button>

              <button
                onClick={() => {
                  setDraftCsv("");
                  clear();
                  setError(null);
                }}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
              >
                Clear
              </button>
            </div>
          </div>

          {error ? (
            <div className="mb-4 rounded-2xl border border-red-900/70 bg-red-950/50 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <textarea
            value={draftCsv}
            onChange={(event) => setDraftCsv(event.target.value)}
            spellCheck={false}
            placeholder="Paste transaction CSV here..."
            className="min-h-[420px] w-full resize-y rounded-2xl border border-slate-800 bg-slate-900/80 p-4 font-mono text-sm leading-6 text-slate-200 outline-none ring-0 placeholder:text-slate-600 focus:border-cyan-500"
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
            <h2 className="text-lg font-semibold text-white">Data status</h2>

            <div className="mt-5 space-y-4">
              <StatusRow label="Portfolio loaded" value={loaded ? "Yes" : "No"} />
              <StatusRow label="Valid rows" value={String(engine?.validRows ?? 0)} />
              <StatusRow label="Issues" value={String(engine?.invalidRows.length ?? 0)} />
              <StatusRow label="Source rows" value={String(engine?.sourceRows ?? 0)} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
            <h2 className="text-lg font-semibold text-white">Recent transactions</h2>

            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Ticker</th>
                    <th className="px-4 py-3 text-right">AUD</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {transactions.slice(0, 8).map((transaction) => (
                    <tr key={transaction.id} className="text-slate-300">
                      <td className="px-4 py-3 text-slate-400">{transaction.date}</td>
                      <td className="px-4 py-3">{transaction.action}</td>
                      <td className="px-4 py-3 font-medium text-white">
                        {transaction.assetTicker}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(transaction.totalFeesIncludedAud)}
                      </td>
                    </tr>
                  ))}

                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        No transactions loaded yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          {engine?.invalidRows.length ? (
            <div className="rounded-3xl border border-amber-900/70 bg-amber-950/30 p-5">
              <h2 className="text-lg font-semibold text-amber-100">Ledger issues</h2>

              <div className="mt-4 space-y-3">
                {engine.invalidRows.slice(0, 6).map((issue, index) => (
                  <div
                    key={`${issue.rowNumber}-${issue.field}-${index}`}
                    className="rounded-2xl border border-amber-900/70 bg-slate-950/70 p-3 text-sm"
                  >
                    <p className="font-medium text-amber-100">
                      Row {issue.rowNumber} · {issue.field}
                    </p>
                    <p className="mt-1 text-amber-200/80">{issue.message}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-white">{value}</p>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
