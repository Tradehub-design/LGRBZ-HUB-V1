#!/usr/bin/env bash
set -e

echo "🔧 Holdings Engine Bash 4/4: allocation from holdings..."

cat > 'src/app/(dashboard)/portfolio-allocation/page.tsx' <<'TSX'
"use client";

import { useEffect, useMemo, useState } from "react";
import { loadTxLedger } from "@/lib/transactions/ledgerStorage";
import { calculateHoldingsFromLedger } from "@/lib/holdings/calculateHoldingsFromLedger";
import { usePortfolioStore } from "@/store/portfolioStore";

type Slice = {
  label: string;
  value: number;
  percent: number;
};

function buildSlices(rows: any[], key: string): Slice[] {
  const total = rows.reduce((sum, row) => sum + Number(row.marketValueAud ?? 0), 0);
  const map = new Map<string, number>();

  rows.forEach((row) => {
    const label = String(row[key] ?? "Unknown");
    map.set(label, (map.get(label) ?? 0) + Number(row.marketValueAud ?? 0));
  });

  return Array.from(map.entries())
    .map(([label, value]) => ({
      label,
      value,
      percent: total ? (value / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export default function PortfolioAllocationPage() {
  const storeTransactions = usePortfolioStore((state) => state.transactions);
  const [localTransactions, setLocalTransactions] = useState<any[]>([]);

  useEffect(() => {
    setLocalTransactions(loadTxLedger());
  }, []);

  const transactions = storeTransactions.length ? storeTransactions : localTransactions;

  const holdings = useMemo(() => {
    return calculateHoldingsFromLedger(transactions as any).filter((holding) => holding.status === "Open");
  }, [transactions]);

  const assetClass = useMemo(() => buildSlices(holdings, "assetClass"), [holdings]);
  const sector = useMemo(() => buildSlices(holdings, "sector"), [holdings]);
  const country = useMemo(() => buildSlices(holdings, "country"), [holdings]);
  const platform = useMemo(() => buildSlices(holdings, "platform"), [holdings]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Portfolio Allocation</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Allocation</h1>
        <p className="mt-2 text-sm text-slate-400">
          Allocation calculated directly from open holdings.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AllocationCard title="By Asset Class" rows={assetClass} />
        <AllocationCard title="By Sector" rows={sector} />
        <AllocationCard title="By Country" rows={country} />
        <AllocationCard title="By Platform" rows={platform} />
      </div>
    </div>
  );
}

function AllocationCard({ title, rows }: { title: string; rows: Slice[] }) {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>

      <div className="mt-4 space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-400">No allocation data yet.</p>
        ) : (
          rows.map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-white">{row.label}</span>
                <span className="text-slate-400">
                  {money(row.value)} · {row.percent.toFixed(2)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-cyan-400"
                  style={{ width: `${Math.min(row.percent, 100)}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function money(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}
TSX

npm run build
