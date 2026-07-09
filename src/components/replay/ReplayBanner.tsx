"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function ReplayBanner() {
  const { portfolioValue } = useBusinessSnapshot();

  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">Replay Snapshot</p>
      <p className="mt-2 text-2xl font-bold">${portfolioValue.toLocaleString()}</p>
    </div>
  );
}
