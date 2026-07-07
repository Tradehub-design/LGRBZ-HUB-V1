"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";

function money(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

export default function DividendForecastPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const monthly = useMemo(() => {
    const map = new Map<string, number>();

    data.dividends.forEach((dividend) => {
      const month = dividend.date.slice(5, 7);
      map.set(month, (map.get(month) ?? 0) + dividend.amountAud);
    });

    return [...map.entries()]
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [data.dividends]);

  const annualisedIncome = data.totalDividendsAud;
  const projectedMonthly = annualisedIncome / 12;
  const yieldOnCost = data.totalCostAud > 0 ? (annualisedIncome / data.totalCostAud) * 100 : 0;

  return (
    <div className="min-h-screen space-y-5 bg-[#061421] text-slate-100">
      <section className="rounded-xl border border-[#173047] bg-[#071827] p-5 shadow-2xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Income Engine</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Dividend Forecast</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Forecast base using historical dividend records. Live forward estimates will connect later.
            </p>
          </div>

          <Link href="/dividends" className="rounded-lg border border-[#173047] bg-[#0b1e30] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-sky-500">
            Dividend History
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Historical Income" value={money(data.totalDividendsAud)} />
        <Metric label="Monthly Average" value={money(projectedMonthly)} />
        <Metric label="Yield on Cost" value={`${yieldOnCost.toFixed(2)}%`} />
        <Metric label="Income Records" value={String(data.dividends.length)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Panel title="Forecast Base">
          <div className="grid gap-3 md:grid-cols-3">
            <Mini label="Projected Monthly" value={money(projectedMonthly)} />
            <Mini label="Projected Quarterly" value={money(projectedMonthly * 3)} />
            <Mini label="Projected Annual" value={money(annualisedIncome)} />
          </div>

          <div className="mt-5 space-y-3">
            {monthly.map((row) => (
              <IncomeRow key={row.month} label={`Month ${row.month}`} value={row.amount} max={Math.max(...monthly.map((item) => item.amount), 1)} />
            ))}
          </div>
        </Panel>

        <Panel title="Upcoming Payments">
          <div className="space-y-3">
            {[...data.dividends]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 10)
              .map((dividend) => (
                <div key={dividend.id} className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-white">{dividend.ticker}</p>
                    <p className="text-xs text-slate-500">Based on historical payment · {dividend.date}</p>
                  </div>
                  <p className="text-sm font-semibold text-white">{money(dividend.amountAud)}</p>
                </div>
              ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#173047] bg-[#071827] p-4 shadow-xl">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#173047] bg-[#071827] p-4 shadow-xl">
      <h2 className="mb-4 text-base font-semibold text-white">{title}</h2>
      {children}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function IncomeRow({ label, value, max }: { label: string; value: number; max: number }) {
  const percent = max > 0 ? (value / max) * 100 : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{money(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
    </div>
  );
}
