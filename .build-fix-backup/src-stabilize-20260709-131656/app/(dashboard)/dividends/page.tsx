"use client";

import { useMemo } from "react";
import { IncomeCalendar } from "@/components/workspace/income-calendar";
import { IncomeBarChart } from "@/components/workspace/portfolio-charts";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney } from "@/lib/portfolio-engine/format";
import {
  MetricTile,
  ProgressRow,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function DividendsPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const byTicker = useMemo(() => {
    const map = new Map<string, number>();

    data.dividends.forEach((dividend) => {
      map.set(dividend.ticker, (map.get(dividend.ticker) ?? 0) + dividend.amountAud);
    });

    return [...map.entries()]
      .map(([ticker, amount]) => ({ ticker, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [data.dividends]);

  const byMonth = useMemo(() => {
    const map = new Map<string, number>();

    data.dividends.forEach((dividend) => {
      const month = dividend.date.slice(0, 7);
      map.set(month, (map.get(month) ?? 0) + dividend.amountAud);
    });

    return [...map.entries()]
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);
  }, [data.dividends]);

  const averageMonthly =
    byMonth.length > 0 ? byMonth.reduce((sum, row) => sum + row.amount, 0) / byMonth.length : 0;

  const maxTicker = Math.max(...byTicker.map((item) => item.amount), 1);
  const maxMonth = Math.max(...byMonth.map((item) => item.amount), 1);

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Income Engine"
        title="Dividends"
        description="Dividend income calculated from your real transaction ledger."
        actions={<WorkspaceLink href="/dividend-forecast">Forecast Income</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <MetricTile label="Total Dividends" value={formatMoney(data.incomeMetrics.totalIncomeAud, 2)} />
        <MetricTile label="Dividend Records" value={String(data.incomeMetrics.incomeRecords)} />
        <MetricTile label="Average Monthly" value={formatMoney(data.incomeMetrics.monthlyAverageAud, 2)} />
        <MetricTile label="Income Holdings" value={String(data.incomeMetrics.incomeHoldings)} />
      </WorkspaceGrid>



      <WorkspacePanel title="Income Calendar">
        <IncomeCalendar dividends={data.dividends} />
      </WorkspacePanel>


      <WorkspacePanel title="Income Chart">
        <IncomeBarChart data={byMonth.map((row) => ({ month: row.month, amount: row.amount })).reverse()} />
      </WorkspacePanel>


      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <WorkspacePanel title="Dividend History">
          <div className="overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Ticker</th>
                  <th className="px-3 py-3">Platform</th>
                  <th className="px-3 py-3">Sector</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {[...data.dividends]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((dividend) => (
                    <tr key={dividend.id} className="text-slate-300 hover:bg-slate-800/40">
                      <td className="px-3 py-3 text-slate-400">{dividend.date}</td>
                      <td className="px-3 py-3 font-semibold text-white">{dividend.ticker}</td>
                      <td className="px-3 py-3 text-slate-400">{dividend.platform}</td>
                      <td className="px-3 py-3 text-slate-400">{dividend.sector}</td>
                      <td className="px-3 py-3 text-right font-medium text-white">
                        {formatMoney(dividend.amountAud, 2)}
                      </td>
                    </tr>
                  ))}

                {data.dividends.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No dividend records found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </WorkspacePanel>

        <div className="space-y-4">
          <WorkspacePanel title="Top Dividend Payers">
            <div className="space-y-3">
              {byTicker.slice(0, 10).map((row) => (
                <ProgressRow
                  key={row.ticker}
                  label={row.ticker}
                  value={formatMoney(row.amount, 2)}
                  percent={(row.amount / maxTicker) * 100}
                  tone="emerald"
                />
              ))}
            </div>
          </WorkspacePanel>

          <WorkspacePanel title="Monthly Income">
            <div className="space-y-3">
              {byMonth.slice(0, 8).map((row) => (
                <ProgressRow
                  key={row.month}
                  label={row.month}
                  value={formatMoney(row.amount, 2)}
                  percent={(row.amount / maxMonth) * 100}
                  tone="emerald"
                />
              ))}
            </div>
          </WorkspacePanel>
        </div>
      </section>
    </Workspace>
  );
}
