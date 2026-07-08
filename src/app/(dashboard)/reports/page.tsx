"use client";

import { BarChart3, Coins, FileText, Shield, TrendingUp } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";
import {
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
        <PremiumStatCard icon={<FileText />} label="Portfolio Value" value={formatMoney(data.totalValueAud)} tone="blue" />
        <PremiumStatCard icon={<TrendingUp />} label="Return" value={formatMoney(data.totalReturnAud)} helper={formatPercent(data.totalReturnPercent)} tone="green" />
        <PremiumStatCard icon={<Coins />} label="Dividends" value={formatMoney(data.totalDividendsAud)} tone="green" />
        <PremiumStatCard icon={<Shield />} label="Health" value={`${data.health.score}/100`} helper={data.health.rating} tone="blue" />
        <PremiumStatCard icon={<BarChart3 />} label="Transactions" value={String(data.transactions.length)} tone="purple" />
      </WorkspaceGrid>



      <WorkspacePanel title="Portfolio Snapshot">
        <div className="rounded-lg border border-[#173047] bg-[#0b1e30] p-4">
          <p className="text-sm font-semibold text-white">{data.snapshot.headline}</p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">Strengths</p>
            <div className="space-y-2">
              {data.snapshot.strengths.map((item) => (
                <p key={item} className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">{item}</p>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">Watch Items</p>
            <div className="space-y-2">
              {data.snapshot.watchItems.map((item) => (
                <p key={item} className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{item}</p>
              ))}
            </div>
          </div>
        </div>
      </WorkspacePanel>


      <WorkspacePanel title="Financial Year Snapshot">
        <div className="space-y-3">
          {data.financialYears.slice(0, 5).map((fy) => (
            <div key={fy.financialYear} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{fy.financialYear}</span>
                <StatusPill tone="blue">{fy.transactionCount} events</StatusPill>
              </div>
              <div className="grid gap-2 text-xs text-slate-400 md:grid-cols-3">
                <span>Buys: {formatMoney(fy.buysAud)}</span>
                <span>Sells: {formatMoney(fy.sellsAud)}</span>
                <span>Dividends: {formatMoney(fy.dividendsAud)}</span>
              </div>
            </div>
          ))}
        </div>
      </WorkspacePanel>


      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <WorkspacePanel title="Report Templates">
          <div className="space-y-3">
            {reportTemplates.map((template) => (
              <div
                key={template}
                className="flex items-center justify-between rounded-lg border border-[#173047] bg-[#0b1e30] p-3 transition hover:border-sky-600"
              >
                <span className="text-sm font-medium text-white">{template}</span>
                <StatusPill tone="blue">Draft</StatusPill>
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
