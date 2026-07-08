"use client";

import { ArrowDownCircle, ArrowUpCircle, BadgeDollarSign, Wallet } from "lucide-react";
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

export default function CashflowPlannerPage() {
  useSeedPortfolio();
  const data = useDashboardData();
  const cashflow = data.cashflowPlan;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Business Suite"
        title="Cashflow Planner"
        description="Track deposits, withdrawals, dividends and portfolio cashflow patterns."
        actions={
          <>
            <WorkspaceLink href="/business-model">Business Model</WorkspaceLink>
            <WorkspaceLink href="/transactions">Transactions</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<ArrowDownCircle />} label="Deposits" value={formatMoney(cashflow.depositsAud, 2)} tone="green" />
        <PremiumStatCard icon={<ArrowUpCircle />} label="Withdrawals" value={formatMoney(cashflow.withdrawalsAud, 2)} tone="rose" />
        <PremiumStatCard icon={<BadgeDollarSign />} label="Dividends" value={formatMoney(cashflow.dividendsAud, 2)} tone="blue" />
        <PremiumStatCard icon={<Wallet />} label="Net Cashflow" value={formatMoney(cashflow.netCashflowAud, 2)} tone="purple" />
      </WorkspaceGrid>

      <WorkspacePanel title="Recent Portfolio Cashflow">
        <div className="space-y-3">
          {data.portfolioReplay.slice(0, 12).map((point) => (
            <div key={point.date} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{point.date}</p>
                <StatusPill tone={point.netActivityAud >= 0 ? "green" : "rose"}>
                  {formatMoney(point.netActivityAud, 2)}
                </StatusPill>
              </div>
              <div className="mt-2 grid gap-2 text-xs text-slate-400 md:grid-cols-4">
                <span>Buys {formatMoney(point.buysAud, 2)}</span>
                <span>Sells {formatMoney(point.sellsAud, 2)}</span>
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
