"use client";

import { useMemo } from "react";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatNumber, formatPercent } from "@/lib/portfolio-engine/format";
import {
  MetricTile,
  ProgressRow,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function AnalyticsPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const transactionTypes = useMemo(() => {
    const map = new Map<string, number>();

    data.transactions.forEach((transaction) => {
      map.set(transaction.action, (map.get(transaction.action) ?? 0) + 1);
    });

    return [...map.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [data.transactions]);

  const monthlyActivity = useMemo(() => {
    const map = new Map<string, { buys: number; sells: number; dividends: number; deposits: number }>();

    data.transactions.forEach((transaction) => {
      const month = transaction.date.slice(0, 7);
      const current = map.get(month) ?? { buys: 0, sells: 0, dividends: 0, deposits: 0 };

      if (transaction.action === "Buy") current.buys += transaction.totalFeesIncludedAud;
      if (transaction.action === "Sell") current.sells += transaction.totalFeesIncludedAud;
      if (transaction.action === "Cash Dividend") current.dividends += transaction.totalFeesIncludedAud;
      if (transaction.action === "Cash Deposit") current.deposits += transaction.totalFeesIncludedAud;

      map.set(month, current);
    });

    return [...map.entries()]
      .map(([month, values]) => ({ month, ...values }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);
  }, [data.transactions]);

  const maxType = Math.max(...transactionTypes.map((item) => item.count), 1);
  const maxMonth = Math.max(...monthlyActivity.map((item) => item.buys + item.sells + item.dividends + item.deposits), 1);

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Analytics Engine"
        title="Analytics"
        description="Portfolio behaviour, activity and exposure analysis generated from the transaction engine."
        actions={
          <>
            <WorkspaceLink href="/performance-attribution">Attribution</WorkspaceLink>
            <WorkspaceLink href="/portfolio-health">Health</WorkspaceLink>
            <WorkspaceLink href="/reports">Reports</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-6">
        <MetricTile label="Transactions" value={String(data.transactions.length)} />
        <MetricTile label="Open Holdings" value={String(data.openHoldings.length)} />
        <MetricTile label="Total Return" value={formatMoney(data.totalReturnAud)} helper={formatPercent(data.totalReturnPercent)} />
        <MetricTile label="Dividend Income" value={formatMoney(data.totalDividendsAud)} />
        <MetricTile label="Fees" value={formatMoney(data.performance.feesAud)} />
        <MetricTile label="Health" value={`${data.health.score}/100`} helper={data.health.rating} />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-3">
        <WorkspacePanel title="Transaction Mix">
          <div className="space-y-3">
            {transactionTypes.slice(0, 10).map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={`${formatNumber(item.count, 0)} records`}
                percent={(item.count / maxType) * 100}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Asset Class Exposure">
          <div className="space-y-3">
            {data.allocation.assetClass.map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={`${formatPercent(item.percent)} · ${formatMoney(item.value)}`}
                percent={item.percent}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Risk Exposure">
          <div className="space-y-3">
            {data.allocation.risk.map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={`${formatPercent(item.percent)} · ${formatMoney(item.value)}`}
                percent={item.percent}
                tone={item.label.toLowerCase().includes("high") ? "rose" : "sky"}
              />
            ))}
          </div>
        </WorkspacePanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <WorkspacePanel title="Monthly Activity">
          <div className="overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Month</th>
                  <th className="px-3 py-3 text-right">Buys</th>
                  <th className="px-3 py-3 text-right">Sells</th>
                  <th className="px-3 py-3 text-right">Dividends</th>
                  <th className="px-3 py-3 text-right">Deposits</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {monthlyActivity.map((row) => (
                  <tr key={row.month} className="text-slate-300 hover:bg-slate-800/40">
                    <td className="px-3 py-3 font-semibold text-white">{row.month}</td>
                    <td className="px-3 py-3 text-right">{formatMoney(row.buys)}</td>
                    <td className="px-3 py-3 text-right">{formatMoney(row.sells)}</td>
                    <td className="px-3 py-3 text-right">{formatMoney(row.dividends)}</td>
                    <td className="px-3 py-3 text-right">{formatMoney(row.deposits)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Activity Intensity">
          <div className="space-y-3">
            {monthlyActivity.map((row) => {
              const total = row.buys + row.sells + row.dividends + row.deposits;

              return (
                <ProgressRow
                  key={row.month}
                  label={row.month}
                  value={formatMoney(total)}
                  percent={(total / maxMonth) * 100}
                  tone="violet"
                />
              );
            })}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
