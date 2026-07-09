"use client";

import { getMarketProviderStatus } from "@/lib/market/provider";

export function MarketDataBanner() {
  const status = getMarketProviderStatus();

  if (status.live) {
    return (
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
        Live market data connected via {status.provider}.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
      {status.warning}
    </div>
  );
}
