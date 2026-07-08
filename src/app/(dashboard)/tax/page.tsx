"use client";

import { useMemo } from "react";
import { Coins, FileText, ReceiptText, TrendingUp, Wallet } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import {
  PremiumRow,
  PremiumTable,
  PremiumTableBody,
  PremiumTableHead,
  PremiumTd,
  PremiumTh,
} from "@/components/workspace/premium-table";
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

export default function TaxCentrePage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const taxRows = useMemo(() => {
    return data.transactions
      .filter((tx) => ["Sell", "Cash Dividend", "Cash Interest", "Fee"].includes(tx.action))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [data.transactions]);

  const interest = data.transactions
    .filter((tx) => tx.action === "Cash Interest")
    .reduce((sum, tx) => sum + tx.totalFeesIncludedAud, 0);

  const fees = data.performance.feesAud;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Australian Tax Workspace"
        title="Tax Centre"
        description="Financial year summaries, dividends, realised gains, interest and fee records prepared from your transaction ledger."
        actions={
          <>
            <WorkspaceLink href="/transactions">Ledger</WorkspaceLink>
            <WorkspaceLink href="/reports">Reports</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-5">
        <PremiumStatCard icon={<TrendingUp />} label="Realised P/L" value={formatMoney(data.realisedPlAud)} tone="green" />
        <PremiumStatCard icon={<Coins />} label="Dividends" value={formatMoney(data.totalDividendsAud)} tone="green" />
        <PremiumStatCard icon={<Wallet />} label="Interest" value={formatMoney(interest)} tone="blue" />
        <PremiumStatCard icon={<ReceiptText />} label="Fees" value={formatMoney(fees)} tone="amber" />
        <PremiumStatCard icon={<FileText />} label="Tax Events" value={String(taxRows.length)} tone="purple" />
      </WorkspaceGrid>


      <WorkspacePanel title="Financial Year Summary">
        <PremiumTable>
          <PremiumTableHead>
            <tr>
              <PremiumTh>FY</PremiumTh>
              <PremiumTh align="right">Buys</PremiumTh>
              <PremiumTh align="right">Sells</PremiumTh>
              <PremiumTh align="right">Dividends</PremiumTh>
              <PremiumTh align="right">Interest</PremiumTh>
              <PremiumTh align="right">Fees</PremiumTh>
              <PremiumTh align="right">Events</PremiumTh>
            </tr>
          </PremiumTableHead>

          <PremiumTableBody>
            {data.financialYears.map((fy) => (
              <PremiumRow key={fy.financialYear}>
                <PremiumTd strong>{fy.financialYear}</PremiumTd>
                <PremiumTd align="right">{formatMoney(fy.buysAud, 2)}</PremiumTd>
                <PremiumTd align="right">{formatMoney(fy.sellsAud, 2)}</PremiumTd>
                <PremiumTd align="right">{formatMoney(fy.dividendsAud, 2)}</PremiumTd>
                <PremiumTd align="right">{formatMoney(fy.interestAud, 2)}</PremiumTd>
                <PremiumTd align="right">{formatMoney(fy.feesAud, 2)}</PremiumTd>
                <PremiumTd align="right">{fy.transactionCount}</PremiumTd>
              </PremiumRow>
            ))}
          </PremiumTableBody>
        </PremiumTable>
      </WorkspacePanel>


      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <WorkspacePanel title="Tax Event Register">
          <PremiumTable>
            <PremiumTableHead>
              <tr>
                <PremiumTh>Date</PremiumTh>
                <PremiumTh>Type</PremiumTh>
                <PremiumTh>Asset</PremiumTh>
                <PremiumTh>Platform</PremiumTh>
                <PremiumTh align="right">Amount</PremiumTh>
              </tr>
            </PremiumTableHead>

            <PremiumTableBody>
              {taxRows.slice(0, 80).map((tx) => (
                <PremiumRow key={tx.id}>
                  <PremiumTd>{tx.date}</PremiumTd>
                  <PremiumTd>
                    <StatusPill tone={tx.action === "Sell" ? "rose" : tx.action.includes("Dividend") ? "green" : "amber"}>
                      {tx.action}
                    </StatusPill>
                  </PremiumTd>
                  <PremiumTd strong>{tx.assetTicker}</PremiumTd>
                  <PremiumTd>{tx.platform}</PremiumTd>
                  <PremiumTd align="right" strong>{formatMoney(tx.totalFeesIncludedAud, 2)}</PremiumTd>
                </PremiumRow>
              ))}
            </PremiumTableBody>
          </PremiumTable>
        </WorkspacePanel>

        <WorkspacePanel title="Tax Readiness">
          <div className="space-y-3 text-sm text-slate-300">
            <Note tone="blue" title="Event register active" text="Dividend, sell, interest and fee records are being extracted from the ledger." />
            <Note tone="amber" title="FIFO CGT pending" text="Parcel-level FIFO matching will be added in v1.2." />
            <Note tone="green" title="Reports ready" text="Tax summaries can now be included in report templates." />
            <Note tone="rose" title="Important" text="This is a calculation workspace, not financial advice." />
          </div>
        </WorkspacePanel>
      </section>
    </Workspace>
  );
}

function Note({
  title,
  text,
  tone,
}: {
  title: string;
  text: string;
  tone: "blue" | "amber" | "green" | "rose";
}) {
  return (
    <div className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
      <StatusPill tone={tone}>{title}</StatusPill>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
    </div>
  );
}
