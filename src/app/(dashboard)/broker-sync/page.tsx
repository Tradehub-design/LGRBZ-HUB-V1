"use client";

import { DatabaseZap, RefreshCcw, ShieldCheck, UploadCloud } from "lucide-react";
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
import { formatNumber } from "@/lib/portfolio-engine/format";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

const brokers = [
  { name: "CommSec", status: "CSV Ready", type: "Shares", tone: "green" as const },
  { name: "CommSec International", status: "CSV Ready", type: "International Shares", tone: "green" as const },
  { name: "Coinbase", status: "Manual Ledger", type: "Crypto", tone: "blue" as const },
  { name: "Stake", status: "Planned", type: "Shares", tone: "amber" as const },
  { name: "CMC", status: "Planned", type: "Shares", tone: "amber" as const },
  { name: "Binance", status: "Planned", type: "Crypto", tone: "amber" as const },
];

export default function BrokerSyncPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Data Engine"
        title="Broker Sync"
        description="Broker import and sync centre. Current version uses your seeded CSV ledger; live broker APIs are planned for v2.0."
        actions={
          <>
            <WorkspaceLink href="/transactions">Transactions</WorkspaceLink>
            <WorkspaceLink href="/settings">Settings</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<DatabaseZap />} label="Connected Sources" value="1" helper="Seeded CSV ledger" tone="blue" />
        <PremiumStatCard icon={<ShieldCheck />} label="Brokers Tracked" value={String(brokers.length)} tone="green" />
        <PremiumStatCard icon={<UploadCloud />} label="Transactions Loaded" value={formatNumber(data.transactions.length, 0)} tone="purple" />
        <PremiumStatCard icon={<RefreshCcw />} label="Sync Mode" value="Manual" helper="API sync in v2.0" tone="amber" />
      </WorkspaceGrid>

      <WorkspacePanel title="Broker Sources">
        <PremiumTable>
          <PremiumTableHead>
            <tr>
              <PremiumTh>Broker</PremiumTh>
              <PremiumTh>Type</PremiumTh>
              <PremiumTh>Status</PremiumTh>
              <PremiumTh>Next Step</PremiumTh>
            </tr>
          </PremiumTableHead>

          <PremiumTableBody>
            {brokers.map((broker) => (
              <PremiumRow key={broker.name}>
                <PremiumTd strong>{broker.name}</PremiumTd>
                <PremiumTd>{broker.type}</PremiumTd>
                <PremiumTd>
                  <StatusPill tone={broker.tone}>{broker.status}</StatusPill>
                </PremiumTd>
                <PremiumTd>
                  {broker.status === "Planned" ? "Add import connector" : "Map CSV fields"}
                </PremiumTd>
              </PremiumRow>
            ))}
          </PremiumTableBody>
        </PremiumTable>
      </WorkspacePanel>
    </Workspace>
  );
}
