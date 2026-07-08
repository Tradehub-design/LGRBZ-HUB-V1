"use client";

import { FileText, ReceiptText, TrendingUp, Wallet } from "lucide-react";
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

export default function TaxReportPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Tax Centre"
        title="Tax Report"
        description="Tax-ready portfolio summary based on FIFO disposals, dividends, interest and fees."
        actions={
          <>
            <WorkspaceLink href="/tax">Tax Centre</WorkspaceLink>
            <WorkspaceLink href="/reports">Reports</WorkspaceLink>
            <WorkspaceLink href="/accountant-export">Accountant Export</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<TrendingUp />} label="Net CGT" value={formatMoney(data.cgtSummary.netCapitalGainAud, 2)} tone="green" />
        <PremiumStatCard icon={<Wallet />} label="Dividends" value={formatMoney(data.totalDividendsAud, 2)} tone="blue" />
        <PremiumStatCard icon={<ReceiptText />} label="Fees" value={formatMoney(data.enginePerformance.feesAud, 2)} tone="amber" />
        <PremiumStatCard icon={<FileText />} label="Disposals" value={String(data.cgtSummary.disposalCount)} tone="purple" />
      </WorkspaceGrid>

      <WorkspacePanel title="Financial Year Tax Summary">
        <div className="space-y-3">
          {data.financialYears.map((fy) => (
            <div key={fy.financialYear} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold text-white">{fy.financialYear}</p>
                <StatusPill tone="blue">{fy.transactionCount} events</StatusPill>
              </div>
              <div className="grid gap-2 text-sm text-slate-400 md:grid-cols-5">
                <span>Buys {formatMoney(fy.buysAud, 2)}</span>
                <span>Sells {formatMoney(fy.sellsAud, 2)}</span>
                <span>Dividends {formatMoney(fy.dividendsAud, 2)}</span>
                <span>Interest {formatMoney(fy.interestAud, 2)}</span>
                <span>Fees {formatMoney(fy.feesAud, 2)}</span>
              </div>
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
