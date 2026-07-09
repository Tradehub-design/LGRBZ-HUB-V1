"use client";

import { AssetLogo } from "@/components/workspace/asset-logo";
import { useLivePortfolioValuation } from "@/hooks/useLivePortfolioValuation";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";

export function LivePortfolioMovers() {
  const data = useLivePortfolioValuation();

  const movers = [...data.liveHoldings]
    .sort((a, b) => Math.abs(b.unrealisedPlAud) - Math.abs(a.unrealisedPlAud))
    .slice(0, 8);

  return (
    <div className="space-y-3">
      {movers.map((holding) => (
        <div key={holding.id} className="flex items-center justify-between rounded-lg border border-[#173047] bg-[#0b1e30] p-3">
          <div className="flex items-center gap-3">
            <AssetLogo symbol={holding.ticker} />
            <div>
              <p className="font-semibold text-white">{holding.ticker}</p>
              <p className="text-xs text-slate-500">{formatMoney(holding.marketValueAud, 2)}</p>
            </div>
          </div>

          <div className="text-right">
            <p className={holding.unrealisedPlAud >= 0 ? "font-semibold text-emerald-300" : "font-semibold text-rose-300"}>
              {formatMoney(holding.unrealisedPlAud, 2)}
            </p>
            <p className="text-xs text-slate-500">{formatPercent(holding.unrealisedPlPercent)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
