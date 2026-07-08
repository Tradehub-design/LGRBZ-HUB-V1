"use client";

import { useMemo } from "react";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney } from "@/lib/portfolio-engine/format";
import {
  MetricTile,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function TaxCentrePage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const taxRows = useMemo(() => {
    return data.transactions
      .filter((tx) =>
        ["Sell", "Cash Dividend", "Cash Interest", "Fee"].includes(tx.action),
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [data.transactions]);

  const interest = data.transactions
    .filter((tx) => tx.action === "Cash Interest")
    .reduce((sum, tx) => sum + tx.totalFeesIncludedAud, 0);

  const fees = data.performance.feesAud;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Australian Tax Workspace"
        title="Tax Centre"
        description="Financial year summaries, dividends, realised gains, interest and fee records prepared from your transaction ledger."
        actions={
          <>
            <WorkspaceLink href="/transactions">Ledger</WorkspaceLink>
            <WorkspaceLink href="/reports">Reports</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-5">
        <MetricTile label="Realised P/L" value={formatMoney(data.realisedPlAud)} />
        <MetricTile label="Dividends" value={formatMoney(data.totalDividendsAud)} />
        <MetricTile label="Interest" value={formatMoney(interest)} />
        <MetricTile label="Fees" value={formatMoney(fees)} />
        <MetricTile label="Tax Events" value={String(taxRows.length)} />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <WorkspacePanel title="Tax Event Register">
          <div className="overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Type</th>
                  <th className="px-3 py-3">Asset</th>
                  <th className="px-3 py-3">Platform</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {taxRows.slice(0, 80).map((tx) => (
                  <tr key={tx.id} className="text-slate-300 hover:bg-slate-800/40">
                    <td className="px-3 py-3 text-slate-400">{tx.date}</td>
                    <td className="px-3 py-3">{tx.action}</td>
                    <td className="px-3 py-3 font-semibold text-white">{tx.assetTicker}</td>
                    <td className="px-3 py-3 text-slate-400">{tx.platform}</td>
                    <td className="px-3 py-3 text-right text-white">{formatMoney(tx.totalFeesIncludedAud, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Tax Notes">
          <div className="space-y-3 text-sm text-slate-300">
            <p className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              CGT calculations are placeholder-ready. FIFO parcel matching will be added in v1.2.
            </p>
            <p className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              Franking credits need dividend statement fields before final ATO-ready reporting.
            </p>
            <p className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              This page is currently a tax event workspace, not financial advice.
            </p>
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
