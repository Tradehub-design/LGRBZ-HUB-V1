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

export default function DividendsPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  const byTicker = useMemo(() => {
    const map = new Map<string, number>();

    data.dividends.forEach((dividend) => {
      map.set(dividend.ticker, (map.get(dividend.ticker) ?? 0) + dividend.amountAud);
    });

    return [...map.entries()]
      .map(([ticker, amount]) => ({ ticker, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [data.dividends]);

  const byMonth = useMemo(() => {
    const map = new Map<string, number>();

    data.dividends.forEach((dividend) => {
      const month = dividend.date.slice(0, 7);
      map.set(month, (map.get(month) ?? 0) + dividend.amountAud);
    });

    return [...map.entries()]
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);
  }, [data.dividends]);

  const averageMonthly =
    byMonth.length > 0
      ? byMonth.reduce((sum, row) => sum + row.amount, 0) / byMonth.length
      : 0;

  return (
    <div className="min-h-screen space-y-5 bg-[#061421] text-slate-100">
      <section className="rounded-xl border border-[#173047] bg-[#071827] p-5 shadow-2xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Income Engine</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Dividends</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Dividend income calculated from your real transaction ledger.
            </p>
          </div>

          <Link href="/dividend-forecast" className="rounded-lg border border-[#173047] bg-[#0b1e30] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-sky-500">
            Forecast Income
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Total Dividends" value={money(data.totalDividendsAud)} />
        <Metric label="Dividend Records" value={String(data.dividends.length)} />
        <Metric label="Average Monthly" value={money(averageMonthly)} />
        <Metric label="Income Holdings" value={String(byTicker.length)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Panel title="Dividend History">
          <div className="overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Ticker</th>
                  <th className="px-3 py-3">Platform</th>
                  <th className="px-3 py-3">Sector</th>
                  <th className="px-3 py-3 text-right">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {[...data.dividends]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((dividend) => (
                    <tr key={dividend.id} className="text-slate-300 hover:bg-slate-800/40">
                      <td className="px-3 py-3 text-slate-400">{dividend.date}</td>
                      <td className="px-3 py-3 font-semibold text-white">{dividend.ticker}</td>
                      <td className="px-3 py-3 text-slate-400">{dividend.platform}</td>
                      <td className="px-3 py-3 text-slate-400">{dividend.sector}</td>
                      <td className="px-3 py-3 text-right font-medium text-white">
                        {money(dividend.amountAud)}
                      </td>
                    </tr>
                  ))}

                {data.dividends.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No dividend records found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Top Dividend Payers">
            <div className="space-y-3">
              {byTicker.slice(0, 10).map((row) => (
                <IncomeRow key={row.ticker} label={row.ticker} value={row.amount} max={byTicker[0]?.amount ?? 1} />
              ))}
            </div>
          </Panel>

          <Panel title="Monthly Income">
            <div className="space-y-3">
              {byMonth.slice(0, 8).map((row) => (
                <IncomeRow key={row.month} label={row.month} value={row.amount} max={Math.max(...byMonth.map((item) => item.amount), 1)} />
              ))}
            </div>
          </Panel>
        </div>
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
