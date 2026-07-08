"use client";

import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatPercent } from "@/lib/portfolio-engine/format";
import {
  MetricTile,
  ProgressRow,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function PortfolioHealthPage() {
  useSeedPortfolio();

  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Risk Engine"
        title="Portfolio Health"
        description="Health score, concentration risk and diversification checks calculated from your transaction engine."
        actions={
          <>
            <WorkspaceLink href="/holdings">Holdings</WorkspaceLink>
            <WorkspaceLink href="/portfolio-allocation">Allocation</WorkspaceLink>
            <WorkspaceLink href="/analytics">Analytics</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-5">
        <MetricTile label="Health Score" value={`${data.health.score}/100`} helper={data.health.rating} />
        <MetricTile label="Risk Score" value={`${data.risk.riskScore}/100`} helper={data.risk.concentrationLevel} />
        <MetricTile label="Largest Holding" value={formatPercent(data.risk.largestHoldingPercent)} />
        <MetricTile label="Largest Sector" value={formatPercent(data.risk.largestSectorPercent)} />
        <MetricTile label="High Risk Exposure" value={formatPercent(data.risk.highRiskPercent)} />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <WorkspacePanel title="Health Breakdown">
          <div className="space-y-4">
            <ProgressRow
              label="Health Score"
              value={`${data.health.score}/100`}
              percent={data.health.score}
              tone="emerald"
            />

            <ProgressRow
              label="Risk Score"
              value={`${data.risk.riskScore}/100`}
              percent={data.risk.riskScore}
              tone="amber"
            />

            <ProgressRow
              label="Largest Holding"
              value={formatPercent(data.risk.largestHoldingPercent)}
              percent={data.risk.largestHoldingPercent}
              tone="sky"
            />

            <ProgressRow
              label="Largest Sector"
              value={formatPercent(data.risk.largestSectorPercent)}
              percent={data.risk.largestSectorPercent}
              tone="violet"
            />

            <ProgressRow
              label="High Risk Exposure"
              value={formatPercent(data.risk.highRiskPercent)}
              percent={data.risk.highRiskPercent}
              tone="rose"
            />

            <ProgressRow
              label="Cash Weight"
              value={formatPercent(data.risk.cashPercent)}
              percent={data.risk.cashPercent}
              tone="sky"
            />
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Recommendations">
          <div className="space-y-3">
            {data.health.recommendations.map((recommendation, index) => (
              <div
                key={`${recommendation}-${index}`}
                className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3"
              >
                <p className="text-sm text-slate-200">{recommendation}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <WorkspacePanel title="Sector Concentration">
          <div className="space-y-3">
            {data.allocation.sector.slice(0, 8).map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={formatPercent(item.percent)}
                percent={item.percent}
                tone={item.percent > 35 ? "amber" : "sky"}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Country Exposure">
          <div className="space-y-3">
            {data.allocation.country.slice(0, 8).map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={formatPercent(item.percent)}
                percent={item.percent}
                tone={item.percent > 70 ? "amber" : "sky"}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Risk Allocation">
          <div className="space-y-3">
            {data.allocation.risk.slice(0, 8).map((item) => (
              <ProgressRow
                key={item.label}
                label={item.label}
                value={formatPercent(item.percent)}
                percent={item.percent}
                tone={item.label.toLowerCase().includes("high") ? "rose" : "sky"}
              />
            ))}
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}
