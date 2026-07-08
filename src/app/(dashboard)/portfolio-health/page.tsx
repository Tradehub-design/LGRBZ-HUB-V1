"use client";

import { RiskRadar } from "@/components/workspace/risk-radar";
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


      <WorkspacePanel title="Risk Radar">
        <RiskRadar
          largestHoldingPercent={data.risk.largestHoldingPercent}
          largestSectorPercent={data.risk.largestSectorPercent}
          largestCountryPercent={data.risk.largestCountryPercent}
          highRiskPercent={data.risk.highRiskPercent}
          cashPercent={data.risk.cashPercent}
        />
      </WorkspacePanel>


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
            {data.recommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3"
              >
                <p className="text-sm font-semibold text-white">{recommendation.title}</p>
                <p className="mt-1 text-sm text-slate-400">{recommendation.detail}</p>
                <p className="mt-2 text-xs text-sky-300">{recommendation.category} · {recommendation.priority}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </section>


      <WorkspacePanel title="Portfolio Alerts">
        <div className="grid gap-3 md:grid-cols-3">
          {data.alerts.map((alert) => (
            <div key={alert.id} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              <p className="text-sm font-semibold text-white">{alert.title}</p>
              <p className="mt-1 text-sm text-slate-400">{alert.message}</p>
            </div>
          ))}
        </div>
      </WorkspacePanel>

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
