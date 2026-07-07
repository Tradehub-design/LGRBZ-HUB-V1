"use client";

import { useMemo, useState } from "react";
import { buildPortfolio } from "@/lib/portfolio-engine/buildPortfolio";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { usePortfolioStore } from "@/store/portfolioStore";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatDate(value: string | null) {
  if (!value) return "Auto-loaded seed ledger";
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function TransactionsPage() {
  useSeedPortfolio();

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
  const [showImport, setShowImport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
      .slice(0, 12);
  }, [transactions]);

  const totals = useMemo(() => {
    return {
      transactions: transactions.length,
      holdings: holdings.filter((holding) => holding.status === "Open").length,
      dividends: dividends.reduce((sum, item) => sum + item.amountAud, 0),
      cash: cashAccounts.reduce((sum, item) => sum + item.balanceAud, 0),
      cost: engine?.summary.totalCostAud ?? 0,
      fees: engine?.summary.feesAud ?? 0,
      realised: engine?.summary.realisedPlAud ?? 0,
    };
  }, [transactions, holdings, dividends, cashAccounts, engine]);

  function handleBuildPortfolio() {
    try {
      setError(null);

      if (!draftCsv.trim()) {
        setError("Paste your updated transaction CSV data first.");
        return;
      }

      const result = buildPortfolio(draftCsv);
      setRawLedgerCsv(draftCsv);
      setEngine(result, draftCsv);
      setShowImport(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process transactions.");
    }
  }

  return (
    <div className="min-h-screen space-y-5 bg-[#061421] px-4 py-4 text-slate-100">
      <section className="rounded-xl border border-slate-700/70 bg-[#071827] p-4 shadow-2xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">LGRBZ</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Transactions</h1>
            <p className="mt-1 text-sm text-slate-400">
              Seeded ledger loaded from your uploaded transaction history. This is now the source of truth for the portfolio engine.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowImport((value) => !value)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              {showImport ? "Hide Import" : "Update Ledger"}
            </button>

            <button
              onClick={() => {
                clear();
                setDraftCsv("");
                setError(null);
              }}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <MetricCard label="Transactions" value={String(totals.transactions)} />
        <MetricCard label="Open Holdings" value={String(totals.holdings)} />
        <MetricCard label="Cash" value={formatCurrency(totals.cash)} />
        <MetricCard label="Invested Cost" value={formatCurrency(totals.cost)} />
        <MetricCard label="Dividends" value={formatCurrency(totals.dividends)} />
        <MetricCard label="Fees" value={formatCurrency(totals.fees)} />
        <MetricCard label="Realised P/L" value={formatCurrency(totals.realised)} />
      </section>

      {showImport ? (
        <section className="rounded-xl border border-slate-700/70 bg-[#071827] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Manual ledger update</h2>
              <p className="text-sm text-slate-400">Only use this when replacing the built-in seeded ledger.</p>
            </div>

            <button
              onClick={handleBuildPortfolio}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
            >
              Apply Update
            </button>
          </div>

          {error ? (
            <div className="mb-3 rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <textarea
            value={draftCsv}
            onChange={(event) => setDraftCsv(event.target.value)}
            spellCheck={false}
            placeholder="Paste updated transaction CSV here..."
            className="min-h-[280px] w-full resize-y rounded-xl border border-slate-700 bg-[#0b1e30] p-4 font-mono text-xs leading-5 text-slate-200 outline-none placeholder:text-slate-600 focus:border-sky-400"
          />
        </section>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="rounded-xl border border-slate-700/70 bg-[#071827] p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Transaction History</h2>
              <p className="text-xs text-slate-400">Showing latest transactions from the seeded portfolio ledger.</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              {loaded ? "Live Engine" : "Loading"}
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-700/70">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Symbol</th>
                  <th className="px-3 py-3">Platform</th>
                  <th className="px-3 py-3 text-right">Qty</th>
                  <th className="px-3 py-3 text-right">Price</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="text-slate-300 hover:bg-slate-800/40">
                    <td className="px-3 py-3 text-slate-400">{transaction.date}</td>
                    <td className="px-3 py-3">
                      <span className="rounded-md bg-slate-800 px-2 py-1 text-[11px] text-slate-200">
                        {transaction.action}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-semibold text-white">{transaction.assetTicker}</td>
                    <td className="px-3 py-3 text-slate-400">{transaction.platform}</td>
                    <td className="px-3 py-3 text-right">{transaction.quantity || "-"}</td>
                    <td className="px-3 py-3 text-right">{transaction.price ? formatCurrency(transaction.price) : "-"}</td>
                    <td className="px-3 py-3 text-right font-medium text-white">
                      {formatCurrency(transaction.totalFeesIncludedAud)}
                    </td>
                  </tr>
                ))}

                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      No transactions loaded yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <Panel title="Ledger Status">
            <StatusRow label="Portfolio loaded" value={loaded ? "Yes" : "No"} />
            <StatusRow label="Valid rows" value={String(engine?.validRows ?? 0)} />
            <StatusRow label="Issues" value={String(engine?.invalidRows.length ?? 0)} />
            <StatusRow label="Source rows" value={String(engine?.sourceRows ?? 0)} />
            <StatusRow label="Last updated" value={formatDate(lastUpdatedAt)} />
          </Panel>

          <Panel title="Engine Coverage">
            <StatusRow label="Holdings" value={String(holdings.length)} />
            <StatusRow label="Cash accounts" value={String(cashAccounts.length)} />
            <StatusRow label="Dividend records" value={String(dividends.length)} />
            <StatusRow label="Total fees" value={formatCurrency(totals.fees)} />
          </Panel>

          {engine?.invalidRows.length ? (
            <Panel title="Ledger Issues">
              <div className="space-y-2">
                {engine.invalidRows.slice(0, 6).map((issue, index) => (
                  <div key={`${issue.rowNumber}-${issue.field}-${index}`} className="rounded-lg bg-amber-950/40 p-3 text-xs">
                    <p className="font-semibold text-amber-200">Row {issue.rowNumber} · {issue.field}</p>
                    <p className="mt-1 text-amber-100/80">{issue.message}</p>
                  </div>
                ))}
              </div>
            </Panel>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700/70 bg-[#071827] p-4 shadow-xl">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-700/70 bg-[#071827] p-4">
      <h2 className="mb-4 text-base font-semibold text-white">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2 last:border-0 last:pb-0">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-semibold text-white">{value}</span>
    </div>
  );
}
