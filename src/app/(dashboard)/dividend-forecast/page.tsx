"use client";

import { useMemo } from "react";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";
import {
  MetricTile,
  ProgressRow,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function DividendForecastPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const monthly = useMemo(() => {
    const map = new Map<string, number>();

    data.dividends.forEach((dividend) => {
      const month = dividend.date.slice(5, 7);
      map.set(month, (map.get(month) ?? 0) + dividend.amountAud);
    });

    return [...map.entries()]
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [data.dividends]);

  const annualisedIncome = data.totalDividendsAud;
  const projectedMonthly = annualisedIncome / 12;
  const yieldOnCost = data.totalCostAud > 0 ? (annualisedIncome / data.totalCostAud) * 100 : 0;
  const maxMonth = Math.max(...monthly.map((item) => item.amount), 1);

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Income Engine"
        title="Dividend Forecast"
        description="Forecast base using historical dividend records. Live forward estimates will connect later."
        actions={<WorkspaceLink href="/dividends">Dividend History</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <MetricTile label="Historical Income" value={formatMoney(data.totalDividendsAud, 2)} />
        <MetricTile label="Monthly Average" value={formatMoney(projectedMonthly, 2)} />
        <MetricTile label="Yield on Cost" value={formatPercent(yieldOnCost)} />
        <MetricTile label="Income Records" value={String(data.dividends.length)} />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <WorkspacePanel title="Forecast Base">
          <div className="grid gap-3 md:grid-cols-3">
            <Mini label="Projected Monthly" value={formatMoney(projectedMonthly, 2)} />
            <Mini label="Projected Quarterly" value={formatMoney(projectedMonthly * 3, 2)} />
            <Mini label="Projected Annual" value={formatMoney(annualisedIncome, 2)} />
          </div>

          <div className="mt-5 space-y-3">
            {monthly.map((row) => (
              <ProgressRow
                key={row.month}
                label={`Month ${row.month}`}
                value={formatMoney(row.amount, 2)}
                percent={(row.amount / maxMonth) * 100}
                tone="emerald"
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Upcoming Payments">
          <div className="space-y-3">
            {[...data.dividends]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 10)
              .map((dividend) => (
                <div
                  key={dividend.id}
                  className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{dividend.ticker}</p>
                    <p className="text-xs text-slate-500">Based on historical payment · {dividend.date}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">{formatMoney(dividend.amountAud, 2)}</p>
                </div>
              ))}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
