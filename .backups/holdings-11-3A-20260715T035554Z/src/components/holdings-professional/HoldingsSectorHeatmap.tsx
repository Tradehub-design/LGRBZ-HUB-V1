"use client";

import Link from "next/link";
import {
  ArrowRight,
  Layers3,
} from "lucide-react";
import type {
  HoldingsVisualSnapshot,
} from "@/lib/holdings-professional/holdingsVisualModels";

type HoldingsSectorHeatmapProps = {
  snapshot:
    HoldingsVisualSnapshot;
};

function tone(
  value: number | null
): string {
  if (
    value === null ||
    value === 0
  ) {
    return "border-slate-700 bg-slate-800/60";
  }

  return value > 0
    ? "border-emerald-400/20 bg-emerald-400/10"
    : "border-rose-400/20 bg-rose-400/10";
}

export function HoldingsSectorHeatmap({
  snapshot,
}: HoldingsSectorHeatmapProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522]">
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-300">
            <Layers3 className="h-5 w-5" />
          </span>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-300/80">
              Sector Intelligence
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Sector Heatmap
            </h2>
          </div>
        </div>

        <Link
          href="/portfolio-allocation"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300"
        >
          Full analysis

          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {snapshot.sectors
          .slice(
            0,
            8
          )
          .map(
            (
              sector
            ) => (
              <article
                key={sector.sector}
                className={[
                  "rounded-xl",
                  "border",
                  "p-4",
                  tone(
                    sector.gainLossPercent
                  ),
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {sector.sector}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      {sector.holdingCount} holdings
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-white">
                    {sector.weight.toFixed(
                      1
                    )}
                    %
                  </p>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-950/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                    style={{
                      width: `${Math.min(
                        100,
                        sector.weight
                      )}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Return
                  </span>

                  <span
                    className={
                      (
                        sector.gainLossPercent ||
                        0
                      ) >= 0
                        ? "font-semibold text-emerald-300"
                        : "font-semibold text-rose-300"
                    }
                  >
                    {sector.gainLossPercent ===
                    null
                      ? "—"
                      : `${sector.gainLossPercent > 0 ? "+" : ""}${sector.gainLossPercent.toFixed(
                          2
                        )}%`}
                  </span>
                </div>
              </article>
            )
          )}
      </div>
    </section>
  );
}
