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

export default function HoldingsPage() {
  useSeedPortfolio();

  const data = useDashboardData();
  const openHoldings = data.openHoldings;
  const totalCost = data.totalCostAud || 1;

  return (
    <div className="min-h-screen space-y-5 bg-[#061421] text-slate-100">
      <section className="rounded-xl border border-[#173047] bg-[#071827] p-5 shadow-2xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Portfolio Core</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Holdings</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Current positions calculated directly from your seeded transaction ledger.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <QuickLink href="/transactions">Source Ledger</QuickLink>
            <QuickLink href="/portfolio-allocation">Allocation</QuickLink>
            <QuickLink href="/portfolio-health">Health</QuickLink>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric label="Open Positions" value={String(openHoldings.length)} />
        <Metric label="Cost Base" value={money(data.totalCostAud)} />
        <Metric label="Cash" value={money(data.totalCashAud)} />
        <Metric label="Dividends" value={money(data.totalDividendsAud)} />
        <Metric label="Realised P/L" value={money(data.realisedPlAud)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_0.7fr]">
        <div className="rounded-xl border border-[#173047] bg-[#071827] p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Holdings Table</h2>
              <p className="text-xs text-slate-400">Sorted by portfolio weight.</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              Real Engine
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Ticker</th>
                  <th className="px-3 py-3">Platform</th>
                  <th className="px-3 py-3">Asset</th>
                  <th className="px-3 py-3">Sector</th>
                  <th className="px-3 py-3 text-right">Qty</th>
                  <th className="px-3 py-3 text-right">Avg Cost</th>
                  <th className="px-3 py-3 text-right">Cost Base</th>
                  <th className="px-3 py-3 text-right">Weight</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {[...openHoldings]
                  .sort((a, b) => b.totalCostAud - a.totalCostAud)
                  .map((holding) => {
                    const weight = (holding.totalCostAud / totalCost) * 100;

                    return (
                      <tr key={holding.id} className="text-slate-300 hover:bg-slate-800/40">
                        <td className="px-3 py-3 font-semibold text-white">{holding.ticker}</td>
                        <td className="px-3 py-3 text-slate-400">{holding.platform}</td>
                        <td className="px-3 py-3">{holding.assetClass}</td>
                        <td className="px-3 py-3 text-slate-400">{holding.sector}</td>
                        <td className="px-3 py-3 text-right">{number(holding.quantity)}</td>
                        <td className="px-3 py-3 text-right">{money(holding.averageCostAud)}</td>
                        <td className="px-3 py-3 text-right font-medium text-white">
                          {money(holding.totalCostAud)}
                        </td>
                        <td className="px-3 py-3 text-right text-sky-300">{number(weight)}%</td>
                      </tr>
                    );
                  })}

                {openHoldings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-slate-500">
                      No open holdings found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <Panel title="Top Holdings">
            <div className="space-y-3">
              {data.topHoldings.slice(0, 8).map((holding) => (
                <WeightRow
                  key={holding.id}
                  label={holding.ticker}
                  value={holding.totalCostAud}
                  percent={holding.weightPercent}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Risk Split">
            <div className="space-y-3">
              {data.allocation.risk.slice(0, 6).map((item) => (
                <WeightRow key={item.label} label={item.label} value={item.value} percent={item.percent} />
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

function WeightRow({ label, value, percent }: { label: string; value: number; percent: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{number(percent)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
      <p className="mt-1 text-right text-xs text-slate-500">{money(value)}</p>
    </div>
  );
}

function QuickLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="rounded-lg border border-[#173047] bg-[#0b1e30] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-sky-500">
      {children}
    </Link>
  );
}
