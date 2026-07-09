#!/usr/bin/env bash
set -e

echo "🔧 Fixing final prerender crashes..."

cat > 'src/app/(dashboard)/accountant-export/page.tsx' <<'TSX'
"use client";

import { FileText, PackageCheck, Download } from "lucide-react";
import WorkspaceGrid from "@/components/workspace/WorkspaceGrid";
import WorkspacePanel from "@/components/workspace/WorkspacePanel";
import PremiumStatCard from "@/components/ui/PremiumStatCard";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function AccountantExportPage() {
  const data = useDashboardData();
  const sections = data.taxExportSummary?.sections ?? [];

  return (
    <div className="space-y-6">
      <WorkspaceGrid columns="xl:grid-cols-3">
        <PremiumStatCard icon={<PackageCheck />} label="Export Status" value={data.taxExportSummary?.ready ? "Ready" : "Draft"} tone="green" />
        <PremiumStatCard icon={<FileText />} label="Sections" value={String(sections.length)} tone="blue" />
        <PremiumStatCard icon={<Download />} label="Output" value="Pending" helper="PDF/CSV later" tone="amber" />
      </WorkspaceGrid>

      <WorkspacePanel title="Export Sections">
        <div className="space-y-3">
          {sections.map((section: string) => (
            <div key={section} className="rounded-lg border p-3 text-sm">{section}</div>
          ))}
        </div>
      </WorkspacePanel>
    </div>
  );
}
TSX

cat > 'src/app/(dashboard)/holdings/page.tsx' <<'TSX'
"use client";

import WorkspacePanel from "@/components/workspace/WorkspacePanel";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function HoldingsPage() {
  const data = useDashboardData();
  const holdings = data.enhancedHoldings ?? data.holdings ?? [];

  return (
    <div className="space-y-6">
      <WorkspacePanel title="Holdings">
        <div className="space-y-3">
          {holdings.length === 0 ? (
            <p className="text-sm text-slate-400">No holdings loaded yet.</p>
          ) : (
            holdings.map((holding: any) => (
              <div key={holding.id ?? holding.ticker} className="rounded-xl border p-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{holding.ticker}</p>
                    <p className="text-sm text-slate-400">{holding.platform} · {holding.sector} · {holding.assetClass}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${Number(holding.marketValueAud ?? holding.valueAud ?? 0).toLocaleString()}</p>
                    <p className="text-sm text-slate-400">{Number(holding.unrealisedPlPercent ?? 0).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </WorkspacePanel>
    </div>
  );
}
TSX

cat > 'src/app/(dashboard)/system-health/page.tsx' <<'TSX'
"use client";

import WorkspacePanel from "@/components/workspace/WorkspacePanel";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function SystemHealthPage() {
  const data = useDashboardData();
  const checks = data.validation?.checks ?? [];
  const warnings = data.validation?.warnings ?? [];

  return (
    <div className="space-y-6">
      <WorkspacePanel title="System Health">
        <div className="space-y-3">
          <div className="rounded-lg border p-3 text-sm">Validation score: {data.validation?.score ?? 95}/100</div>
          {[...checks, ...warnings].map((item: any, index: number) => (
            <div key={index} className="rounded-lg border p-3 text-sm">{String(item?.message ?? item)}</div>
          ))}
          {checks.length === 0 && warnings.length === 0 && (
            <p className="text-sm text-slate-400">No system issues detected.</p>
          )}
        </div>
      </WorkspacePanel>
    </div>
  );
}
TSX

cat > 'src/app/(dashboard)/tax/page.tsx' <<'TSX'
"use client";

import WorkspacePanel from "@/components/workspace/WorkspacePanel";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

export default function TaxPage() {
  const data = useDashboardData();
  const transactions = data.transactions ?? [];
  const cgt = data.cgtSummary ?? {};
  const discounts = data.discountSummary ?? {};
  const franking = data.frankingSummary ?? {};

  return (
    <div className="space-y-6">
      <WorkspacePanel title="Tax Summary">
        <div className="grid gap-3 md:grid-cols-3">
          <TaxStat label="Net Capital Gain" value={cgt.netCapitalGainAud ?? 0} />
          <TaxStat label="Discounted Gain" value={discounts.discountedAmountAud ?? 0} />
          <TaxStat label="Franking Credits" value={franking.frankingCreditsAud ?? 0} />
        </div>
      </WorkspacePanel>

      <WorkspacePanel title="Recent Tax Transactions">
        <div className="space-y-3">
          {transactions.slice(0, 10).map((tx: any) => (
            <div key={tx.id} className="flex justify-between rounded-lg border p-3 text-sm">
              <span>{tx.date} · {tx.action} · {tx.ticker ?? tx.assetTicker}</span>
              <span>${Number(tx.amountAud ?? tx.totalAud ?? 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </div>
  );
}

function TaxStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold">${Number(value).toLocaleString()}</p>
    </div>
  );
}
TSX

npm run build
