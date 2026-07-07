"use client";

import Link from "next/link";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

function money(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function number(value: number) {
  return new Intl.NumberFormat("en-AU", {
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export default function PortfolioAllocationPage() {
  useSeedPortfolio();

  const data = useDashboardData();

  return (
    <div className="min-h-screen space-y-5 bg-[#061421] text-slate-100">
      <section className="rounded-xl border border-[#173047] bg-[#071827] p-5 shadow-2xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Portfolio Core</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Portfolio Allocation</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Allocation, concentration and exposure calculated from the transaction engine.
            </p>
          </div>

          <Link href="/holdings" className="rounded-lg border border-[#173047] bg-[#0b1e30] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-sky-500">
            View Holdings
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total Cost Base" value={money(data.totalCostAud)} />
        <Metric label="Asset Classes" value={String(data.allocation.assetClass.length)} />
        <Metric label="Sectors" value={String(data.allocation.sector.length)} />
        <Metric label="Platforms" value={String(data.allocation.platform.length)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <AllocationPanel title="Asset Class" rows={data.allocation.assetClass} />
        <AllocationPanel title="Sector" rows={data.allocation.sector} />
        <AllocationPanel title="Country" rows={data.allocation.country} />
        <AllocationPanel title="Currency" rows={data.allocation.currency} />
        <AllocationPanel title="Platform" rows={data.allocation.platform} />
        <AllocationPanel title="Risk" rows={data.allocation.risk} />
      </section>
    </div>
  );
}

type Row = {
  label: string;
  value: number;
  percent: number;
};

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#173047] bg-[#071827] p-4 shadow-xl">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function AllocationPanel({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <div className="rounded-xl border border-[#173047] bg-[#071827] p-4 shadow-xl">
      <h2 className="mb-4 text-base font-semibold text-white">{title}</h2>

      <div className="space-y-3">
        {rows.slice(0, 10).map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-slate-300">{row.label}</span>
              <span className="text-slate-400">{number(row.percent)}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.min(row.percent, 100)}%` }} />
            </div>

            <p className="mt-1 text-right text-xs text-slate-500">{money(row.value)}</p>
          </div>
        ))}

        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">No allocation data available.</p>
        ) : null}
      </div>
    </div>
  );
}
