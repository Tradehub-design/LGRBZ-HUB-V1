"use client";

import Link from "next/link";
import {
  Activity,
  CalendarDays,
  ChevronRight,
  Shield,
  TrendingUp,
  Wallet,
} from "lucide-react";
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

const logoPalette = [
  "from-blue-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-orange-500 to-amber-400",
  "from-violet-500 to-purple-400",
  "from-rose-500 to-pink-400",
  "from-slate-400 to-slate-600",
];

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
        <HeroMetric icon={<Wallet />} label="Portfolio Value" value={formatMoney(data.totalValueAud, 2)} helper="Market value + cash" tone="blue" />
        <HeroMetric icon={<TrendingUp />} label="Total Return" value={formatMoney(data.totalReturnAud, 2)} helper={formatPercent(data.totalReturnPercent)} tone="green" />
        <HeroMetric icon={<Wallet />} label="Unrealised P/L" value={formatMoney(data.valuation.unrealisedPlAud, 2)} helper={formatPercent(data.valuation.unrealisedPlPercent)} tone={data.valuation.unrealisedPlAud >= 0 ? "green" : "purple"} />
        <HeroMetric icon={<CalendarDays />} label="Income Return" value={formatPercent(data.enginePerformance.incomeReturnPercent)} helper={formatMoney(data.totalDividendsAud, 2)} tone="violet" />
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
                <linearGradient id="areaPremium" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1f8cff" stopOpacity="0.48" />
                  <stop offset="100%" stopColor="#1f8cff" stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path
                d="M0,190 C80,175 110,145 170,155 C230,166 250,125 320,132 C390,140 420,94 480,105 C555,118 590,70 650,76 C720,82 750,42 810,54 C850,62 870,43 900,35 L900,240 L0,240 Z"
                fill="url(#areaPremium)"
              />
              <path
                d="M0,190 C80,175 110,145 170,155 C230,166 250,125 320,132 C390,140 420,94 480,105 C555,118 590,70 650,76 C720,82 750,42 810,54 C850,62 870,43 900,35"
                fill="none"
                stroke="#1f8cff"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
              />
              <circle cx="900" cy="35" r="7" fill="#1f8cff" stroke="#93c5fd" strokeWidth="3" />
            </svg>

            <div className="absolute bottom-4 left-5 right-5 flex justify-between text-xs text-slate-500">
              {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </WorkspacePanel>

        <WorkspacePanel title="Asset Allocation">
          <div className="grid gap-5 md:grid-cols-[180px_1fr] xl:grid-cols-1">
            <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#1f8cff_0_42%,#7c3aed_42%_70%,#f97316_70%_86%,#14b8a6_86%_94%,#64748b_94%_100%)] shadow-[0_0_60px_rgba(31,140,255,0.20)]">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#071827]">
                <p className="text-center text-xs text-slate-400">
                  Allocation
                  <span className="block text-lg font-semibold text-white">{data.allocation.assetClass.length}</span>
                </p>
              </div>
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
            {data.recentTransactions.slice(0, 6).map((tx, index) => (
              <TransactionRow
                key={tx.id}
                symbol={tx.assetTicker}
                title={`${tx.action} · ${tx.assetTicker}`}
                meta={tx.date}
                value={formatMoney(tx.totalFeesIncludedAud, 2)}
                index={index}
                type={tx.action}
              />
            ))}
          </div>
          <BottomLink href="/transactions">View all transactions</BottomLink>
        </WorkspacePanel>

        <WorkspacePanel title="Top Movers">
          <div className="space-y-3">
            {data.topMovers.slice(0, 6).map((mover, index) => (
              <TransactionRow
                key={mover.ticker}
                symbol={mover.ticker}
                title={mover.ticker}
                meta={`${mover.direction === "up" ? "Gain" : mover.direction === "down" ? "Loss" : "Flat"} · ${formatPercent(mover.changePercent)}`}
                value={formatMoney(mover.changeAud, 2)}
                index={index}
                type={mover.direction === "up" ? "Buy" : mover.direction === "down" ? "Sell" : "Other"}
              />
            ))}
          </div>
          <BottomLink href="/holdings">View holdings</BottomLink>
        </WorkspacePanel>

        <WorkspacePanel title="Performance Breakdown">
          <div className="space-y-4">
            <ProgressRow label="Unrealised P/L" value={formatMoney(data.valuation.unrealisedPlAud, 2)} percent={Math.min(Math.abs(data.valuation.unrealisedPlPercent), 100)} tone={data.valuation.unrealisedPlAud >= 0 ? "emerald" : "rose"} />
            <ProgressRow label="Dividend Return" value={formatPercent(data.enginePerformance.incomeReturnPercent)} percent={Math.min(data.enginePerformance.incomeReturnPercent, 100)} tone="sky" />
            <ProgressRow label="Net Invested" value={formatMoney(data.enginePerformance.netInvestedAud, 2)} percent={60} tone="violet" />
            <ProgressRow label="Fees" value={formatMoney(data.enginePerformance.feesAud, 2)} percent={20} tone="amber" />
          </div>
          <BottomLink href="/portfolio-health">View health report</BottomLink>
        </WorkspacePanel>
      </section>

      <WorkspacePanel title="Alerts & Notifications">
        <div className="grid gap-3 md:grid-cols-3">
          {data.alerts.slice(0, 6).map((alert) => (
            <News key={alert.id} title={alert.title} meta={alert.message} />
          ))}
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
    <div className="group rounded-xl border border-[#173047] bg-[#071827] p-4 shadow-xl transition duration-300 hover:-translate-y-0.5 hover:border-sky-600/80 hover:bg-[#0b1e30]">
      <div className="flex items-start justify-between">
        <p className="text-xs text-slate-400">{label}</p>
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tones[tone]}`}>
          <div className="h-5 w-5">{icon}</div>
        </div>
      </div>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-emerald-300">{helper}</p>
      <MiniSparkline tone={tone} />
    </div>
  );
}

function MiniSparkline({ tone }: { tone: "blue" | "green" | "purple" | "violet" }) {
  const stroke = {
    blue: "#1f8cff",
    green: "#10b981",
    purple: "#a855f7",
    violet: "#8b5cf6",
  }[tone];

  return (
    <svg viewBox="0 0 180 36" className="mt-4 h-9 w-full opacity-90">
      <path
        d="M2,28 C20,20 30,32 45,22 C58,14 68,24 80,16 C92,9 104,20 118,14 C132,8 146,18 160,11 C170,7 175,10 178,8"
        fill="none"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TransactionRow({
  symbol,
  title,
  meta,
  value,
  index,
  type,
}: {
  symbol: string;
  title: string;
  meta: string;
  value: string;
  index: number;
  type: string;
}) {
  const badge =
    type.toLowerCase().includes("buy")
      ? "bg-emerald-500/10 text-emerald-300"
      : type.toLowerCase().includes("sell")
        ? "bg-rose-500/10 text-rose-300"
        : type.toLowerCase().includes("dividend")
          ? "bg-sky-500/10 text-sky-300"
          : "bg-slate-500/10 text-slate-300";

  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-3 last:border-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-3">
        <LogoBubble symbol={symbol} index={index} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-white">{title}</p>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${badge}`}>
              {type.split(" ")[0]}
            </span>
          </div>
          <p className="text-xs text-slate-500">{meta}</p>
        </div>
      </div>
      <p className="shrink-0 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function LogoBubble({ symbol, index }: { symbol: string; index: number }) {
  const initials = symbol.replace(".AX", "").replace("ASX:", "").slice(0, 3).toUpperCase();
  const gradient = logoPalette[index % logoPalette.length];

  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-[10px] font-black text-white shadow-lg`}>
      {initials}
    </div>
  );
}

function BottomLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-sky-300 hover:text-sky-200">
      {children} <ChevronRight className="h-4 w-4" />
    </Link>
  );
}

function News({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-lg border border-[#173047] bg-[#0b1e30] p-3 transition hover:border-sky-600/80">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-sky-300" />
        <p className="text-sm font-semibold text-white">{title}</p>
      </div>
      <p className="mt-1 text-xs text-slate-500">{meta}</p>
    </div>
  );
}
