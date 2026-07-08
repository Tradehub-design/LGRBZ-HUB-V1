"use client";

import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";
import {
  MetricTile,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

const reportTemplates = [
  "Executive Portfolio Report",
  "Performance Report",
  "Income Report",
  "Tax Summary",
  "Risk Report",
  "Asset Allocation Report",
  "Member Contribution Report",
];

export default function ReportsPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Reporting Engine"
        title="Reports"
        description="Investor reports generated from the transaction engine. Export to PDF and Excel will be added later."
        actions={
          <>
            <WorkspaceLink href="/dashboard">Dashboard</WorkspaceLink>
            <WorkspaceLink href="/tax">Tax Centre</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-5">
        <MetricTile label="Portfolio Value" value={formatMoney(data.totalValueAud)} />
        <MetricTile label="Return" value={formatMoney(data.totalReturnAud)} helper={formatPercent(data.totalReturnPercent)} />
        <MetricTile label="Dividends" value={formatMoney(data.totalDividendsAud)} />
        <MetricTile label="Health" value={`${data.health.score}/100`} helper={data.health.rating} />
        <MetricTile label="Transactions" value={String(data.transactions.length)} />
      </WorkspaceGrid>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <WorkspacePanel title="Report Templates">
          <div className="space-y-3">
            {reportTemplates.map((template) => (
              <div
                key={template}
                className="flex items-center justify-between rounded-lg border border-[#173047] bg-[#0b1e30] p-3"
              >
                <span className="text-sm font-medium text-white">{template}</span>
                <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs text-sky-300">
                  Draft
                </span>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Executive Snapshot">
          <div className="space-y-3 text-sm text-slate-300">
            <SummaryRow label="Invested Cost" value={formatMoney(data.totalCostAud)} />
            <SummaryRow label="Cash Available" value={formatMoney(data.totalCashAud)} />
            <SummaryRow label="Dividend Income" value={formatMoney(data.totalDividendsAud)} />
            <SummaryRow label="Realised P/L" value={formatMoney(data.realisedPlAud)} />
            <SummaryRow label="Risk Score" value={`${data.risk.riskScore}/100`} />
            <SummaryRow label="Health Score" value={`${data.health.score}/100`} />
          </div>

          <div className="mt-5 rounded-lg border border-[#173047] bg-[#0b1e30] p-4">
            <p className="text-sm text-slate-300">
              Report export engine will use this data model to generate PDF, Excel and email-ready summaries.
            </p>
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
