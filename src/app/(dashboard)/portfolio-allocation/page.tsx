"use client";

import { AllocationDonutChart, HorizontalBarChart } from "@/components/workspace/portfolio-charts";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
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
import { useDashboardData } from "@/features/dashboard/useDashboardData";

type Row = {
  label: string;
  value: number;
  percent: number;
};

export default function PortfolioAllocationPage() {
  useSeedPortfolio();

  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Portfolio Core"
        title="Portfolio Allocation"
        description="Allocation, concentration and exposure calculated from the transaction engine."
        actions={<WorkspaceLink href="/holdings">View Holdings</WorkspaceLink>}
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <MetricTile label="Total Cost Base" value={formatMoney(data.totalCostAud)} />
        <MetricTile label="Asset Classes" value={String(data.allocation.assetClass.length)} />
        <MetricTile label="Sectors" value={String(data.allocation.sector.length)} />
        <MetricTile label="Platforms" value={String(data.allocation.platform.length)} />
      </WorkspaceGrid>


      <section className="grid gap-4 xl:grid-cols-2">
        <WorkspacePanel title="Asset Class Donut">
          <AllocationDonutChart data={data.allocation.assetClass} />
        </WorkspacePanel>

        <WorkspacePanel title="Sector Exposure Chart">
          <HorizontalBarChart
            data={data.allocation.sector.slice(0, 8).map((row) => ({
              label: row.label,
              value: row.value,
            }))}
          />
        </WorkspacePanel>
      </section>


      <section className="grid gap-4 xl:grid-cols-2">
        <AllocationPanel title="Asset Class" rows={data.allocation.assetClass} />
        <AllocationPanel title="Sector" rows={data.allocation.sector} />
        <AllocationPanel title="Country" rows={data.allocation.country} />
        <AllocationPanel title="Currency" rows={data.allocation.currency} />
        <AllocationPanel title="Platform" rows={data.allocation.platform} />
        <AllocationPanel title="Risk" rows={data.allocation.risk} />
      </section>
    </Workspace>
  );
}

function AllocationPanel({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <WorkspacePanel title={title}>
      <div className="space-y-3">
        {rows.slice(0, 10).map((row) => (
          <ProgressRow
            key={row.label}
            label={row.label}
            value={`${formatPercent(row.percent)} · ${formatMoney(row.value)}`}
            percent={row.percent}
            tone={title === "Risk" && row.label.toLowerCase().includes("high") ? "rose" : "sky"}
          />
        ))}

        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">No allocation data available.</p>
        ) : null}
      </div>
    </WorkspacePanel>
  );
}
