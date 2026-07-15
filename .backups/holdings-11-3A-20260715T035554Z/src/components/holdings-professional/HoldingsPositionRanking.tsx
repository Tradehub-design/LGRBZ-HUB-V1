"use client";

import Link from "next/link";
import {
  ArrowRight,
  Medal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type {
  HoldingsVisualSnapshot,
} from "@/lib/holdings-professional/holdingsVisualModels";

type HoldingsPositionRankingProps = {
  snapshot:
    HoldingsVisualSnapshot;
};

function money(
  value: number,
  currency = "AUD"
): string {
  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }
  ).format(value);
}

export function HoldingsPositionRanking({
  snapshot,
}: HoldingsPositionRankingProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522]">
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
            <Medal className="h-5 w-5" />
          </span>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/80">
              Position Ranking
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Largest Holdings
            </h2>
          </div>
        </div>

        <Link
          href="#holdings-table"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300"
        >
          View table

          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-800">
        {snapshot.positions
          .slice(
            0,
            8
          )
          .map(
            (
              position,
              index
            ) => {
              const ReturnIcon =
                (
                  position.gainLossPercent ||
                  0
                ) >= 0
                  ? TrendingUp
                  : TrendingDown;

              return (
                <Link
                  key={position.symbol}
                  href={`/holdings?symbol=${encodeURIComponent(
                    position.symbol
                  )}`}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-900/45"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-400">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">
                      {position.symbol}
                    </p>

                    <p className="truncate text-[11px] text-slate-600">
                      {position.name}
                    </p>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-white">
                      {money(
                        position.marketValue,
                        position.currency
                      )}
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-600">
                      {position.portfolioWeight.toFixed(
                        2
                      )}
                      % weight
                    </p>
                  </div>

                  <div className="w-20 text-right">
                    <p
                      className={[
                        "inline-flex",
                        "items-center",
                        "justify-end",
                        "gap-1",
                        "text-xs",
                        "font-semibold",
                        (
                          position.gainLossPercent ||
                          0
                        ) >= 0
                          ? "text-emerald-300"
                          : "text-rose-300",
                      ].join(" ")}
                    >
                      <ReturnIcon className="h-3.5 w-3.5" />

                      {position.gainLossPercent ===
                      null
                        ? "—"
                        : `${position.gainLossPercent > 0 ? "+" : ""}${position.gainLossPercent.toFixed(
                            2
                          )}%`}
                    </p>
                  </div>
                </Link>
              );
            }
          )}
      </div>
    </section>
  );
}
