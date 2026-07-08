"use client";

import { useMemo, useState } from "react";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { buildPortfolio } from "@/lib/portfolio-engine/buildPortfolio";
import { formatMoney, formatNumber } from "@/lib/portfolio-engine/format";
import { usePortfolioStore } from "@/store/portfolioStore";
import {
  MetricTile,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function TransactionsPage() {
  useSeedPortfolio();

  const {
    loaded,
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
    return [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 50);
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
    <Workspace>
      <WorkspaceHeader
        eyebrow="Portfolio Core"
        title="Transactions"
        description="The source-of-truth ledger powering holdings, dividends, allocation, dashboard and reporting."
        actions={
          <>
            <button
              onClick={() => setShowImport((value) => !value)}
              className="rounded-lg bg-[#1f8cff] px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
            >
              {showImport ? "Hide Import" : "Update Ledger"}
            </button>
            <WorkspaceLink href="/holdings">Holdings</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-7">
        <MetricTile label="Transactions" value={String(totals.transactions)} />
        <MetricTile label="Open Holdings" value={String(totals.holdings)} />
        <MetricTile label="Cash" value={formatMoney(totals.cash)} />
        <MetricTile label="Invested Cost" value={formatMoney(totals.cost)} />
        <MetricTile label="Dividends" value={formatMoney(totals.dividends)} />
        <MetricTile label="Fees" value={formatMoney(totals.fees)} />
        <MetricTile label="Realised P/L" value={formatMoney(totals.realised)} />
      </WorkspaceGrid>

      {showImport ? (
        <WorkspacePanel title="Manual Ledger Update">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              This replaces the currently loaded ledger for this browser session.
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleBuildPortfolio}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Apply Update
              </button>

              <button
                onClick={() => {
                  setDraftCsv("");
                  clear();
                  setError(null);
                }}
                className="rounded-lg border border-[#173047] bg-[#0b1e30] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-rose-500"
              >
                Reset
              </button>
            </div>
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
            className="min-h-[280px] w-full resize-y rounded-xl border border-[#173047] bg-[#0b1e30] p-4 font-mono text-xs leading-5 text-slate-200 outline-none placeholder:text-slate-600 focus:border-sky-400"
          />
        </WorkspacePanel>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.5fr_0.65fr]">
        <WorkspacePanel title="Transaction Ledger">
          <div className="overflow-hidden rounded-xl border border-[#173047]">
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
                    <td className="px-3 py-3 text-right">{transaction.quantity ? formatNumber(transaction.quantity) : "-"}</td>
                    <td className="px-3 py-3 text-right">{transaction.price ? formatMoney(transaction.price, 2) : "-"}</td>
                    <td className="px-3 py-3 text-right font-medium text-white">
                      {formatMoney(transaction.totalFeesIncludedAud, 2)}
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
        </WorkspacePanel>

        <div className="space-y-4">
          <WorkspacePanel title="Ledger Status">
            <StatusRow label="Portfolio loaded" value={loaded ? "Yes" : "No"} />
            <StatusRow label="Valid rows" value={String(engine?.validRows ?? 0)} />
            <StatusRow label="Issues" value={String(engine?.invalidRows.length ?? 0)} />
            <StatusRow label="Source rows" value={String(engine?.sourceRows ?? 0)} />
          </WorkspacePanel>

          <WorkspacePanel title="Engine Coverage">
            <StatusRow label="Holdings" value={String(holdings.length)} />
            <StatusRow label="Cash accounts" value={String(cashAccounts.length)} />
            <StatusRow label="Dividend records" value={String(dividends.length)} />
            <StatusRow label="Total fees" value={formatMoney(totals.fees)} />
          </WorkspacePanel>
        </div>
      </section>
    </Workspace>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2 text-xs last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
