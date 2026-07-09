"use client";

import { AssetLogo } from "@/components/workspace/asset-logo";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";

type HeatmapHolding = {
  id: string;
  ticker: string;
  sector: string;
  marketValueAud: number;
  unrealisedPlAud: number;
  unrealisedPlPercent: number;
  portfolioWeightPercent: number;
};

export function PortfolioHeatmap({ holdings }: { holdings: HeatmapHolding[] }) {
  if (!holdings.length) {
    return (
      <div className="rounded-2xl border border-[#173047] bg-[#0b1e30] p-8 text-center text-sm text-slate-500">
        No holdings available.
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {holdings.slice(0, 12).map((holding) => {
        const positive = holding.unrealisedPlAud >= 0;

        return (
          <div
            key={holding.id}
            className={`rounded-2xl border p-4 shadow-xl transition hover:-translate-y-0.5 ${
              positive
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-rose-500/20 bg-rose-500/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <AssetLogo symbol={holding.ticker} />
              <div>
                <p className="font-semibold text-white">{holding.ticker}</p>
                <p className="text-xs text-slate-400">{holding.sector}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xl font-semibold text-white">
                {formatMoney(holding.marketValueAud, 2)}
              </p>
              <p className={positive ? "text-sm text-emerald-300" : "text-sm text-rose-300"}>
                {formatMoney(holding.unrealisedPlAud, 2)} · {formatPercent(holding.unrealisedPlPercent)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Weight {formatPercent(holding.portfolioWeightPercent)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
