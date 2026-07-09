"use client";

import { Wifi } from "lucide-react";
import { getMarketProviderStatus } from "@/lib/market/provider";

export function LiveStatus() {
  const status = getMarketProviderStatus();

  return (
    <div className="flex items-center gap-2 rounded-full border border-[#173047] px-3 py-1 text-xs">
      <Wifi size={14} />
      {status.live ? (
        <span className="text-emerald-400">
          LIVE • {status.provider}
        </span>
      ) : (
        <span className="text-amber-400">
          DEMO DATA
        </span>
      )}
    </div>
  );
}
