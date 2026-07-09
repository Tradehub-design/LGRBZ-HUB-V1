"use client";

import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function FutureIncome() {
  const { dividends } = useBusinessSnapshot();

  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">Forward Income</p>
      <p className="mt-2 text-2xl font-bold">${dividends.forwardIncome.toLocaleString()}</p>
    </div>
  );
}
