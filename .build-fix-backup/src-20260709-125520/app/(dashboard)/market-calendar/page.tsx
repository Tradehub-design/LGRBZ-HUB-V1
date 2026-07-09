"use client";

import { CalendarDays } from "lucide-react";
import { PremiumStatCard } from "@/components/workspace/premium-stat-card";
import { StatusPill } from "@/components/workspace/status-pill";
import { getDemoMarketCalendar } from "@/lib/market/marketCalendar";
import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

export default function MarketCalendarPage() {
  const events = getDemoMarketCalendar();
  const highImpact = events.filter((event) => event.impact === "High").length;

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Market Intelligence"
        title="Market Calendar"
        description="Upcoming dividends, earnings and economic events."
        actions={
          <>
            <WorkspaceLink href="/market-watchlist">Watchlist</WorkspaceLink>
            <WorkspaceLink href="/dividends">Dividends</WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-3">
        <PremiumStatCard icon={<CalendarDays />} label="Events" value={String(events.length)} tone="blue" />
        <PremiumStatCard label="High Impact" value={String(highImpact)} tone="rose" />
        <PremiumStatCard label="Mode" value="Demo" helper="Live calendar later" tone="amber" />
      </WorkspaceGrid>

      <WorkspacePanel title="Upcoming Events">
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between rounded-lg border border-[#173047] bg-[#0b1e30] p-4">
              <div>
                <p className="font-semibold text-white">{event.title}</p>
                <p className="text-xs text-slate-500">{event.date} · {event.type}</p>
              </div>
              <StatusPill tone={event.impact === "High" ? "rose" : event.impact === "Medium" ? "amber" : "blue"}>
                {event.impact}
              </StatusPill>
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </Workspace>
  );
}
