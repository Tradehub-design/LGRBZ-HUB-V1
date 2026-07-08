"use client";

import { Activity, CalendarDays, Filter, LineChart, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Workspace, WorkspaceHeader, WorkspacePanel } from "@/components/workspace";

const items = [
  { href: "/market", label: "Market Centre", description: "Live quote foundation.", icon: Activity },
  { href: "/market-watchlist", label: "Market Watchlist", description: "TradingView-style watchlist.", icon: Star },
  { href: "/market-movers", label: "Market Movers", description: "Top gainers and losers.", icon: TrendingUp },
  { href: "/stock-screener", label: "Stock Screener", description: "Screen ideas and signals.", icon: Filter },
  { href: "/market-calendar", label: "Market Calendar", description: "Events and dividends.", icon: CalendarDays },
  { href: "/technicals", label: "Technicals", description: "Trend and indicators.", icon: LineChart },
];

export default function MarketIntelligencePage() {
  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Market Intelligence"
        title="Market Intelligence Hub"
        description="Central hub for watchlists, movers, calendar, technicals and stock screening."
      />

      <WorkspacePanel title="Market Workspaces">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-[#173047] bg-[#0b1e30] p-5 transition hover:-translate-y-1 hover:border-sky-500"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500/10 text-sky-300">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-sm text-slate-400">{item.description}</p>
              </Link>
            );
          })}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
