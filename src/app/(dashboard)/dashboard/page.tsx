"use client";

import Link from "next/link";
import { Shield, Wallet, TrendingUp, CalendarDays, Activity } from "lucide-react";
import { useSeedPortfolio } from "@/features/transactions/useSeedPortfolio";
import { useDashboardData } from "@/features/dashboard/useDashboardData";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";
import {
  ProgressRow,
  Workspace,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function DashboardPage() {
  useSeedPortfolio();
  const data = useDashboardData();

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Portfolio Command Centre"
        title="Dashboard"
        description="Your portfolio overview, key metrics, activity, income, risk and allocation."
        actions={
          <>
            <WorkspaceLink href="/transactions">Transactions</WorkspaceLink>
            <WorkspaceLink href="/holdings">Holdings</WorkspaceLink>
            <WorkspaceLink href="/reports">Reports</WorkspaceLink>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <HeroMetric icon={<Wallet />} label="Portfolio Value" value={formatMoney(data.totalValueAud, 2)} helper="Cost basis + cash" tone="blue" />
        <HeroMetric icon={<TrendingUp />} label="Total Return" value={formatMoney(data.totalReturnAud, 2)} helper={formatPercent(data.totalReturnPercent)} tone="green" />
        <HeroMetric icon={<Wallet />} label="Cash Balance" value={formatMoney(data.totalCashAud, 2)} helper="Available cash" tone="purple" />
        <HeroMetric icon={<CalendarDays />} label="Dividend Income" value={formatMoney(data.totalDividendsAud, 2)} helper="Received income" tone="violet" />
        <HeroMetric icon={<Shield />} label="Portfolio Health" value={`${data.health.score}/100`} helper={data.health.rating} tone="blue" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.75fr]">
        <WorkspacePanel title="Portfolio Growth">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-semibold text-white">{formatMoney(data.totalValueAud, 2)}</p>
              <p className="mt-1 text-sm text-emerald-300">
                {formatMoney(data.totalReturnAud, 2)} · {formatPercent(data.totalReturnPercent)}
              </p>
            </div>

            <div className="flex rounded-lg border border-[#173047] bg-[#0b1e30] p-1 text-xs text-slate-400">
              {["1M", "3M", "6M", "YTD", "1Y", "ALL"].map((item) => (
                <span key={item} className={item === "1Y" ? "rounded-md bg-blue-600 px-3 py-1 text-white" : "px-3 py-1"}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative h-72 overflow-hidden rounded-xl border border-[#173047] bg-[#081a2b] p-5">
            <div className="absolute inset-x-5 top-8 h-px bg-slate-800" />
            <div className="absolute inset-x-5 top-24 h-px bg-slate-800" />
            <div className="absolute inset-x-5 top-40 h-px bg-slate-800" />
            <div className="absolute inset-x-5 top-56 h-px bg-slate-800" />

            <svg viewBox="0 0 900 240" className="relative z-10 h-full w-full">
              <defs>
                <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1f8cff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1f8cff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0,190 C80,175 110,145 170,155 C230,166 250,125 320,132 C390,140 420,94 480,105 C555,118 590,70 650,76 C720,82 750,42 810,54 C850,62 870,43 900,35 L900,240 L0,240 Z"
                fill="url(#area)"
              />
              <path
                d="M0,190 C80,175 110,145 170,155 C230,166 250,125 320,132 C390,140 420,94 480,105 C555,118 590,70 650,76 C720,82 750,42 810,54 C850,62 870,43 900,35"
                fill="none"
                stroke="#1f8cff"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Asset Allocation">
          <div className="grid gap-5 md:grid-cols-[180px_1fr] xl:grid-cols-1">
            <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#1f8cff_0_42%,#7c3aed_42%_70%,#f97316_70%_86%,#14b8a6_86%_94%,#64748b_94%_100%)]">
              <div className="h-24 w-24 rounded-full bg-[#071827]" />
            </div>

            <div className="space-y-3">
              {data.allocation.assetClass.slice(0, 6).map((item) => (
                <ProgressRow
                  key={item.label}
                  label={item.label}
                  value={formatPercent(item.percent)}
                  percent={item.percent}
                />
              ))}
            </div>
          </div>
        </WorkspacePanel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <WorkspacePanel title="Recent Transactions">
          <div className="space-y-3">
            {data.recentTransactions.slice(0, 6).map((tx) => (
              <Row key={tx.id} label={`${tx.action} · ${tx.assetTicker}`} meta={tx.date} value={formatMoney(tx.totalFeesIncludedAud, 2)} />
            ))}
          </div>
          <BottomLink href="/transactions">View all transactions</BottomLink>
        </WorkspacePanel>

        <WorkspacePanel title="Upcoming Dividends">
          <div className="space-y-3">
            {data.latestDividends.slice(0, 6).map((dividend) => (
              <Row key={dividend.id} label={dividend.ticker} meta={dividend.date} value={formatMoney(dividend.amountAud, 2)} />
            ))}
          </div>
          <BottomLink href="/dividends">View dividends</BottomLink>
        </WorkspacePanel>

        <WorkspacePanel title="Portfolio Health Breakdown">
          <div className="space-y-4">
            <ProgressRow label="Diversification" value={`${data.health.score}/100`} percent={data.health.score} tone="emerald" />
            <ProgressRow label="Risk Management" value={`${100 - data.risk.riskScore}/100`} percent={100 - data.risk.riskScore} tone="sky" />
            <ProgressRow label="Asset Allocation" value={`${Math.max(0, 100 - data.risk.largestSectorPercent).toFixed(0)}/100`} percent={Math.max(0, 100 - data.risk.largestSectorPercent)} tone="amber" />
            <ProgressRow label="Liquidity" value={formatPercent(data.risk.cashPercent)} percent={data.risk.cashPercent} tone="violet" />
          </div>
          <BottomLink href="/portfolio-health">View health report</BottomLink>
        </WorkspacePanel>
      </section>

      <WorkspacePanel title="Market News">
        <div className="grid gap-3 md:grid-cols-3">
          <News title="Live news feed planned" meta="Market engine v2.0" />
          <News title="Broker sync planned" meta="Data engine v2.0" />
          <News title="AI insights planned" meta="Analyst workspace" />
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}

function HeroMetric({
  icon,
  label,
  value,
  helper,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  helper: string;
  tone: "blue" | "green" | "purple" | "violet";
}) {
  const tones = {
    blue: "bg-blue-500/15 text-blue-300",
    green: "bg-emerald-500/15 text-emerald-300",
    purple: "bg-purple-500/15 text-purple-300",
    violet: "bg-violet-500/15 text-violet-300",
  };

  return (
    <div className="rounded-xl border border-[#173047] bg-[#071827] p-4 shadow-xl">
      <div className="flex items-start justify-between">
        <p className="text-xs text-slate-400">{label}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tones[tone]}`}>
          <div className="h-5 w-5">{icon}</div>
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-emerald-300">{helper}</p>
      <div className="mt-4 h-8 rounded bg-[linear-gradient(90deg,transparent,#1f8cff55,transparent)]" />
    </div>
  );
}

function Row({ label, meta, value }: { label: string; meta: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="text-xs text-slate-500">{meta}</p>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function BottomLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="mt-5 block text-center text-sm font-semibold text-sky-300 hover:text-sky-200">
      {children} →
    </Link>
  );
}

function News({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-sky-300" />
        <p className="text-sm font-semibold text-white">{title}</p>
      </div>
      <p className="mt-1 text-xs text-slate-500">{meta}</p>
    </div>
  );
}
