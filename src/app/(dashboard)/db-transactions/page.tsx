"use client";

import { Database } from "lucide-react";
import { PortfolioSelector } from "@/components/database/portfolio-selector";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { useDbTransactions } from "@/hooks/useDbTransactions";
import { usePortfolioSelectionStore } from "@/store/portfolioSelectionStore";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function DbTransactionsPage() {
  const selectedPortfolioId = usePortfolioSelectionStore((state) => state.selectedPortfolioId);
  const data = useDbTransactions(selectedPortfolioId);

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="v2.0 Platform"
        title="Database Transactions"
        description="Supabase-backed portfolio transaction loading."
        actions={<WorkspaceLink href="/db-portfolios">DB Portfolios</WorkspaceLink>}
      />

      <PortfolioSelector />

      <WorkspaceGrid columns="xl:grid-cols-3">
        <PremiumStatCard icon={<Database />} label="Transactions" value={String(data.transactions.length)} tone="blue" />
        <PremiumStatCard label="Loading" value={data.loading ? "Yes" : "No"} tone="purple" />
        <PremiumStatCard label="Status" value={data.error ? "Error" : "Ready"} helper={data.error ?? "No error"} tone={data.error ? "rose" : "green"} />
      </WorkspaceGrid>

      <WorkspacePanel title="Database Transactions">
        <div className="space-y-3">
          {data.transactions.map((tx) => (
            <div key={tx.id} className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{tx.ticker}</p>
                <p className="text-sm text-slate-400">{tx.action}</p>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {tx.transaction_date} · Qty {tx.quantity} · Price {tx.price}
              </p>
            </div>
          ))}

          {!selectedPortfolioId ? (
            <p className="rounded-lg border border-[#173047] bg-[#0b1e30] p-4 text-sm text-slate-400">
              Select a portfolio to load database transactions.
            </p>
          ) : null}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
