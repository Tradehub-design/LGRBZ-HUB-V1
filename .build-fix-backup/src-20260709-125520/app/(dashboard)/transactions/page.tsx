"use client";

import { useMemo, useState } from "react";
import { AssetLogo } from "@/components/workspace/asset-logo";
import { TransactionEntryForm } from "@/components/transactions/transaction-entry-form";
import { FilterBar } from "@/components/workspace/filter-bar";
import { useWorkspaceSearch } from "@/hooks/useWorkspaceSearch";
import { TransactionTimeline } from "@/components/workspace/transaction-timeline";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { buildPortfolio } from "@/lib/portfolio-engine/buildPortfolio";
import { formatMoney, formatNumber } from "@/lib/portfolio-engine/format";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
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

  const data = useDashboardData();

  const [draftCsv, setDraftCsv] = useState(rawLedgerCsv);
  const [showImport, setShowImport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions]);

  const transactionSearch = useWorkspaceSearch(
    sortedTransactions,
    (transaction) => `${transaction.date} ${transaction.action} ${transaction.assetTicker} ${transaction.platform} ${transaction.sector} ${transaction.country}`,
  );

  const recentTransactions = transactionSearch.filteredRows.slice(0, 80);

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

      <TransactionEntryForm />

      <FilterBar placeholder="Search transactions..." value={transactionSearch.query} onChange={transactionSearch.setQuery} />

      <WorkspaceGrid columns="xl:grid-cols-7">
        <MetricTile label="Transactions" value={String(totals.transactions)} />
        <MetricTile label="Open Holdings" value={String(totals.holdings)} />
        <MetricTile label="Cash" value={formatMoney(totals.cash, 2)} />
        <MetricTile label="Invested Cost" value={formatMoney(totals.cost, 2)} />
        <MetricTile label="Dividends" value={formatMoney(totals.dividends, 2)} />
        <MetricTile label="Fees" value={formatMoney(totals.fees, 2)} />
        <MetricTile label="Realised P/L" value={formatMoney(totals.realised, 2)} />
      </WorkspaceGrid>

      {showImport ? (
        <WorkspacePanel title="Manual Ledger Update">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-slate-400">This replaces the currently loaded ledger for this browser session.</p>

            <div className="flex gap-2">
              <button onClick={handleBuildPortfolio} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
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

          {error ? <div className="mb-3 rounded-lg border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-200">{error}</div> : null}

          <textarea
            value={draftCsv}
            onChange={(event) => setDraftCsv(event.target.value)}
            spellCheck={false}
            placeholder="Paste updated transaction CSV here..."
            className="min-h-[280px] w-full resize-y rounded-xl border border-[#173047] bg-[#0b1e30] p-4 font-mono text-xs leading-5 text-slate-200 outline-none placeholder:text-slate-600 focus:border-sky-400"
          />
        </WorkspacePanel>
      ) : null}


      <WorkspacePanel title="Data Quality">
        <div className="grid gap-3 md:grid-cols-3">
          <MetricTile label="Quality Score" value={`${data.dataQuality.score}/100`} helper={data.dataQuality.rating} />
          <MetricTile label="Issue Count" value={String(data.dataQuality.issueCount)} />
          <MetricTile label="Engine Rows" value={String(engine?.validRows ?? 0)} />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {data.dataQuality.warnings.map((warning) => (
            <div key={warning} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3 text-sm text-slate-300">
              {warning}
            </div>
          ))}
        </div>
      </WorkspacePanel>



      <WorkspacePanel title="Recent Activity Timeline">
        <TransactionTimeline transactions={recentTransactions} />
      </WorkspacePanel>


      <section className="grid gap-4 xl:grid-cols-[1.5fr_0.65fr]">
        <WorkspacePanel title="Transaction Ledger">
          <div className="overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Asset</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Platform</th>
                  <th className="px-3 py-3 text-right">Qty</th>
                  <th className="px-3 py-3 text-right">Price</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="text-slate-300 hover:bg-slate-800/40">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <AssetLogo symbol={transaction.assetTicker} />
                        <span className="font-semibold text-white">{transaction.assetTicker}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={badgeClass(transaction.action)}>{transaction.action}</span>
                    </td>
                    <td className="px-3 py-3 text-slate-400">{transaction.date}</td>
                    <td className="px-3 py-3 text-slate-400">{transaction.platform}</td>
                    <td className="px-3 py-3 text-right">{transaction.quantity ? formatNumber(transaction.quantity) : "-"}</td>
                    <td className="px-3 py-3 text-right">{transaction.price ? formatMoney(transaction.price, 2) : "-"}</td>
                    <td className="px-3 py-3 text-right font-medium text-white">
                      {formatMoney(transaction.totalFeesIncludedAud, 2)}
                    </td>
                  </tr>
                ))}
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
            <StatusRow label="Total fees" value={formatMoney(totals.fees, 2)} />
          </WorkspacePanel>
        </div>
      </section>
    </Workspace>
  );
}

function badgeClass(action: string) {
  const base = "rounded-md px-2 py-1 text-[11px] font-semibold";
  const lower = action.toLowerCase();

  if (lower.includes("buy")) return `${base} bg-emerald-500/10 text-emerald-300`;
  if (lower.includes("sell")) return `${base} bg-rose-500/10 text-rose-300`;
  if (lower.includes("dividend")) return `${base} bg-sky-500/10 text-sky-300`;
  if (lower.includes("deposit")) return `${base} bg-violet-500/10 text-violet-300`;
  if (lower.includes("fee")) return `${base} bg-amber-500/10 text-amber-300`;

  return `${base} bg-slate-500/10 text-slate-300`;
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-2 text-xs last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
