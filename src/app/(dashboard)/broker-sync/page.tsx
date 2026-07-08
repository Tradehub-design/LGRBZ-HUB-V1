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
import { BROKER_SOURCES, getBrokerImportSummary } from "@/lib/portfolio-engine/brokerImport";
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

export default function BrokerSyncPage() {
  useSeedPortfolio();

  const data = useDashboardData();
  const summary = getBrokerImportSummary();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Data Engine"
        title="Broker Sync"
        description="Broker import and sync centre. Current version supports seeded CSV ledger and broker import planning."
        actions={
          <>
            <WorkspaceLink href="/transactions">Transactions</WorkspaceLink>
            <WorkspaceLink href="/import-centre">Import Centre</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard icon={<DatabaseZap />} label="Broker Sources" value={String(summary.total)} helper={`${summary.ready} ready`} tone="blue" />
        <PremiumStatCard icon={<ShieldCheck />} label="Ready Imports" value={String(summary.ready)} tone="green" />
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
              <PremiumTh>Formats</PremiumTh>
              <PremiumTh>Next Step</PremiumTh>
            </tr>
          </PremiumTableHead>

          <PremiumTableBody>
            {BROKER_SOURCES.map((broker) => (
              <PremiumRow key={broker.id}>
                <PremiumTd strong>{broker.name}</PremiumTd>
                <PremiumTd>{broker.type}</PremiumTd>
                <PremiumTd>
                  <StatusPill tone={broker.status === "Ready" ? "green" : broker.status === "Manual" ? "blue" : "amber"}>
                    {broker.status}
                  </StatusPill>
                </PremiumTd>
                <PremiumTd>{broker.supportedFormats.join(", ")}</PremiumTd>
                <PremiumTd>
                  {broker.status === "Planned"
                    ? "Build field mapper"
                    : broker.status === "Manual"
                      ? "Manual ledger support"
                      : "CSV mapping ready"}
                </PremiumTd>
              </PremiumRow>
            ))}
          </PremiumTableBody>
        </PremiumTable>
      </WorkspacePanel>
    </Workspace>
  );
}
