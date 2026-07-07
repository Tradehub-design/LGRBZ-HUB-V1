"use client";

import Link from "next/link";
import type { ReactNode } from "react";
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

export default function DashboardPage() {
  useSeedPortfolio();

  const data = useDashboardData();

  const healthScore = data.openHoldings.length >= 10 ? 82 : data.openHoldings.length >= 5 ? 68 : 54;
  const riskScore =
    data.allocation.risk.find((item) => item.label === "High Risk")?.percent ?? 0;

  return (
    <div className="min-h-screen space-y-5 bg-[#061421] text-slate-100">
      <section className="rounded-xl border border-[#173047] bg-[#071827] p-5 shadow-2xl">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">Portfolio Command Centre</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-400">
              Executive summary powered by your real transaction ledger. Detailed analysis now lives in the dedicated pages.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <QuickLink href="/transactions">Transactions</QuickLink>
            <QuickLink href="/holdings">Holdings</QuickLink>
            <QuickLink href="/analytics">Analytics</QuickLink>
            <QuickLink href="/reports">Reports</QuickLink>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <Metric label="Total Value" value={money(data.totalValueAud)} helper="Cost basis + cash" />
        <Metric label="Daily G/L" value="$0" helper="Live prices in v2.0" />
        <Metric label="Cash Available" value={money(data.totalCashAud)} helper="Across cash accounts" />
        <Metric label="Dividends" value={money(data.totalDividendsAud)} helper="Received income" />
        <Metric label="Health Score" value={`${healthScore}/100`} helper="Portfolio quality" />
        <Metric label="Risk Score" value={`${number(riskScore)}%`} helper="High risk exposure" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Panel title="Portfolio Summary" action={<Link href="/holdings" className="text-xs text-sky-300">View holdings</Link>}>
          <div className="grid gap-3 md:grid-cols-3">
            <MiniStat label="Invested Cost" value={money(data.totalCostAud)} />
            <MiniStat label="Realised P/L" value={money(data.realisedPlAud)} />
            <MiniStat label="Total Return" value={money(data.totalReturnAud)} />
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border border-[#173047]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1e30] text-slate-400">
                <tr>
                  <th className="px-3 py-3">Holding</th>
                  <th className="px-3 py-3">Platform</th>
                  <th className="px-3 py-3 text-right">Qty</th>
                  <th className="px-3 py-3 text-right">Cost</th>
                  <th className="px-3 py-3 text-right">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.topHoldings.slice(0, 6).map((holding) => (
                  <tr key={holding.id} className="hover:bg-slate-800/40">
                    <td className="px-3 py-3 font-semibold text-white">{holding.ticker}</td>
                    <td className="px-3 py-3 text-slate-400">{holding.platform}</td>
                    <td className="px-3 py-3 text-right text-slate-300">{number(holding.quantity)}</td>
                    <td className="px-3 py-3 text-right text-white">{money(holding.totalCostAud)}</td>
                    <td className="px-3 py-3 text-right text-sky-300">{number(holding.weightPercent)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Asset Allocation" action={<Link href="/portfolio-allocation" className="text-xs text-sky-300">Details</Link>}>
          <div className="space-y-3">
            {data.allocation.assetClass.slice(0, 6).map((item) => (
              <AllocationRow key={item.label} label={item.label} value={item.value} percent={item.percent} />
            ))}

            {data.allocation.assetClass.length === 0 ? (
              <p className="text-sm text-slate-500">No allocation data loaded yet.</p>
            ) : null}
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Panel title="Recent Transactions" action={<Link href="/transactions" className="text-xs text-sky-300">Open ledger</Link>}>
          <div className="space-y-3">
            {data.recentTransactions.slice(0, 6).map((tx) => (
              <ActivityRow key={tx.id} title={`${tx.action} · ${tx.assetTicker}`} meta={tx.date} value={money(tx.totalFeesIncludedAud)} />
            ))}
          </div>
        </Panel>

        <Panel title="Dividend Summary" action={<Link href="/dividends" className="text-xs text-sky-300">View dividends</Link>}>
          <div className="space-y-3">
            {data.latestDividends.slice(0, 6).map((dividend) => (
              <ActivityRow key={dividend.id} title={dividend.ticker} meta={dividend.date} value={money(dividend.amountAud)} />
            ))}

            {data.latestDividends.length === 0 ? (
              <p className="text-sm text-slate-500">No dividends loaded yet.</p>
            ) : null}
          </div>
        </Panel>

        <Panel title="Alerts & Notifications">
          <div className="space-y-3">
            <Alert tone="green" title="Transaction engine active" />
            <Alert tone="blue" title={`${data.transactions.length} transactions loaded`} />
            <Alert tone="amber" title="Live prices not connected yet" />
            <Alert tone="slate" title="Broker sync planned for v2.0" />
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Market Overview">
          <div className="grid gap-3 sm:grid-cols-2">
            <MiniStat label="ASX" value="Pending" />
            <MiniStat label="NASDAQ" value="Pending" />
            <MiniStat label="Crypto" value="Pending" />
            <MiniStat label="AUD/USD" value="Pending" />
          </div>
        </Panel>

        <Panel title="Quick Actions">
          <div className="grid gap-3 sm:grid-cols-4">
            <Action href="/transactions" label="Update Ledger" />
            <Action href="/portfolio-health" label="Health Check" />
            <Action href="/dividend-forecast" label="Forecast Income" />
            <Action href="/tax" label="Tax Centre" />
          </div>
        </Panel>
      </section>
    </div>
  );
}

function Metric({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-xl border border-[#173047] bg-[#071827] p-4 shadow-xl">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[#173047] bg-[#071827] p-4 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function AllocationRow({ label, value, percent }: { label: string; value: number; percent: number }) {
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

function ActivityRow({ title, meta, value }: { title: string; meta: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-slate-500">{meta}</p>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function Alert({ title, tone }: { title: string; tone: "green" | "blue" | "amber" | "slate" }) {
  const tones = {
    green: "bg-emerald-500/10 text-emerald-300",
    blue: "bg-sky-500/10 text-sky-300",
    amber: "bg-amber-500/10 text-amber-300",
    slate: "bg-slate-500/10 text-slate-300",
  };

  return <div className={`rounded-lg px-3 py-2 text-sm ${tones[tone]}`}>{title}</div>;
}

function Action({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="rounded-lg border border-[#173047] bg-[#0b1e30] px-4 py-3 text-center text-sm font-semibold text-slate-200 hover:border-sky-500 hover:text-white">
      {label}
    </Link>
  );
}
