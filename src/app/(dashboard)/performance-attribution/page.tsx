"use client";

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

export default function PerformanceAttributionPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const totalReturn = Math.max(Math.abs(data.totalReturnAud), 1);

  const contributors = [
    { label: "Realised P/L", value: data.realisedPlAud, tone: "sky" as const },
    { label: "Dividend Income", value: data.totalDividendsAud, tone: "emerald" as const },
    { label: "Fees", value: -data.performance.feesAud, tone: "rose" as const },
    { label: "Cash Drag", value: 0, tone: "amber" as const },
  ];

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Attribution Engine"
        title="Performance Attribution"
        description="Breakdown of portfolio return drivers from realised performance, income, fees and allocation."
        actions={
          <>
            <WorkspaceLink href="/analytics">Analytics</WorkspaceLink>
            <WorkspaceLink href="/reports">Reports</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-5">
        <MetricTile label="Total Return" value={formatMoney(data.totalReturnAud)} helper={formatPercent(data.totalReturnPercent)} />
        <MetricTile label="Realised P/L" value={formatMoney(data.realisedPlAud)} />
        <MetricTile label="Dividends" value={formatMoney(data.totalDividendsAud)} />
        <MetricTile label="Fees" value={formatMoney(data.performance.feesAud)} />
        <MetricTile label="Positions" value={String(data.openHoldings.length)} />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <WorkspacePanel title="Return Drivers">
          <div className="space-y-4">
            {contributors.map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={formatMoney(item.value)}
                percent={(Math.abs(item.value) / totalReturn) * 100}
                tone={item.tone}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Top Cost Contributors">
          <div className="overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Holding</th>
                  <th className="px-3 py-3">Sector</th>
                  <th className="px-3 py-3">Risk</th>
                  <th className="px-3 py-3 text-right">Cost Base</th>
                  <th className="px-3 py-3 text-right">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.topHoldings.map((holding) => (
                  <tr key={holding.id} className="text-slate-300 hover:bg-slate-800/40">
                    <td className="px-3 py-3 font-semibold text-white">{holding.ticker}</td>
                    <td className="px-3 py-3 text-slate-400">{holding.sector}</td>
                    <td className="px-3 py-3 text-slate-400">{holding.risk}</td>
                    <td className="px-3 py-3 text-right text-white">{formatMoney(holding.totalCostAud)}</td>
                    <td className="px-3 py-3 text-right text-sky-300">{formatPercent(holding.weightPercent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
