"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function ReplayStatistics() {
  const { cashAccounts, timeline } = useBusinessSnapshot();

  return (
    <div className="grid gap-3 md:grid-cols-3">
      <Stat label="Cash" value={cashAccounts.totalCash} />
      <Stat label="Timeline Points" value={timeline.length} />
      <Stat label="Dividends" value={cashAccounts.totalDividends} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value.toLocaleString()}</p>
    </div>
  );
}
