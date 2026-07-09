"use client";

import { History } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney } from "@/lib/portfolio-engine/format";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function TimelinePage() {
  useSeedPortfolio();
  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Investor Journey"
        title="Portfolio Timeline"
        description="Your investing journey generated from the transaction ledger."
        actions={
          <>
            <WorkspaceLink href="/transactions">Transactions</WorkspaceLink>
            <WorkspaceLink href="/analytics">Analytics</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<History />} label="Timeline Events" value={String(data.portfolioReplay.length)} tone="blue" />
        <PremiumStatCard label="First Record" value={data.transactions.at(-1)?.date ?? "N/A"} tone="purple" />
        <PremiumStatCard label="Latest Record" value={data.transactions[0]?.date ?? "N/A"} tone="green" />
        <PremiumStatCard label="Total Value" value={formatMoney(data.totalValueAud)} tone="amber" />
      </WorkspaceGrid>

      <WorkspacePanel title="Portfolio Journey">
        <div className="space-y-4">
          {data.portfolioReplay.slice(0, 30).map((point) => (
            <div key={point.date} className="rounded-xl border border-[#173047] bg-[#0b1e30] p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{point.date}</p>
                <StatusPill tone={point.netActivityAud >= 0 ? "green" : "rose"}>
                  {formatMoney(point.netActivityAud, 2)}
                </StatusPill>
              </div>

              <div className="mt-3 grid gap-2 text-xs text-slate-400 md:grid-cols-5">
                <span>Buys {formatMoney(point.buysAud, 2)}</span>
                <span>Sells {formatMoney(point.sellsAud, 2)}</span>
                <span>Deposits {formatMoney(point.depositsAud, 2)}</span>
                <span>Dividends {formatMoney(point.dividendsAud, 2)}</span>
                <span>Fees {formatMoney(point.feesAud, 2)}</span>
              </div>
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
