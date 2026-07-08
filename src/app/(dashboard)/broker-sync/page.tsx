"use client";

import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatNumber } from "@/lib/portfolio-engine/format";
import {
  MetricTile,
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

const brokers = [
  { name: "CommSec", status: "CSV Ready", type: "Shares" },
  { name: "CommSec International", status: "CSV Ready", type: "International Shares" },
  { name: "Coinbase", status: "Manual Ledger", type: "Crypto" },
  { name: "Stake", status: "Planned", type: "Shares" },
  { name: "CMC", status: "Planned", type: "Shares" },
  { name: "Binance", status: "Planned", type: "Crypto" },
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
        <MetricTile label="Connected Sources" value="1" helper="Seeded CSV ledger" />
        <MetricTile label="Brokers Tracked" value={String(brokers.length)} />
        <MetricTile label="Transactions Loaded" value={formatNumber(data.transactions.length, 0)} />
        <MetricTile label="Sync Mode" value="Manual" helper="API sync in v2.0" />
      </WorkspaceGrid>

      <WorkspacePanel title="Broker Sources">
        <div className="overflow-hidden rounded-xl border border-[#173047]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1e30] text-slate-400">
              <tr>
                <th className="px-3 py-3">Broker</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Next Step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {brokers.map((broker) => (
                <tr key={broker.name} className="text-slate-300 hover:bg-slate-800/40">
                  <td className="px-3 py-3 font-semibold text-white">{broker.name}</td>
                  <td className="px-3 py-3 text-slate-400">{broker.type}</td>
                  <td className="px-3 py-3 text-sky-300">{broker.status}</td>
                  <td className="px-3 py-3 text-slate-400">
                    {broker.status === "Planned" ? "Add import connector" : "Map CSV fields"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
