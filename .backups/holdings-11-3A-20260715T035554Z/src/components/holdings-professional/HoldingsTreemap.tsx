"use client";

import Link from "next/link";
import {
  ArrowRight,
  Boxes,
} from "lucide-react";
import type {
  HoldingsVisualSnapshot,
} from "@/lib/holdings-professional/holdingsVisualModels";

type HoldingsTreemapProps = {
  snapshot:
    HoldingsVisualSnapshot;
};

function tileClass(
  returnPercent: number | null
): string {
  if (
    returnPercent === null
  ) {
    return "border-slate-700 bg-slate-800/70";
  }

  if (returnPercent >= 20) {
    return "border-emerald-300/30 bg-emerald-300/25";
  }

  if (returnPercent > 0) {
    return "border-emerald-400/20 bg-emerald-400/15";
  }

  if (returnPercent <= -20) {
    return "border-rose-300/30 bg-rose-300/25";
  }

  if (returnPercent < 0) {
    return "border-rose-400/20 bg-rose-400/15";
  }

  return "border-slate-700 bg-slate-800/70";
}

export function HoldingsTreemap({
  snapshot,
}: HoldingsTreemapProps) {
  const visible =
    snapshot.positions.slice(
      0,
      12
    );

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522]">
      <div className="flex items-start justify-between gap-4 border-b border-slate-800 p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <Boxes className="h-5 w-5" />
          </span>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
              Position Map
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Portfolio Treemap
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Tile size reflects portfolio weight and colour reflects return.
            </p>
          </div>
        </div>

        <Link
          href="/portfolio-allocation"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300"
        >
          Allocation

          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid min-h-[330px] grid-cols-2 gap-2 p-4 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map(
          (
            position,
            index
          ) => (
            <Link
              key={position.symbol}
              href={`/holdings?symbol=${encodeURIComponent(
                position.symbol
              )}`}
              className={[
                "group",
                "relative",
                "overflow-hidden",
                "rounded-xl",
                "border",
                "p-3",
                "transition",
                "duration-200",
                "hover:-translate-y-0.5",
                tileClass(
                  position.gainLossPercent
                ),
                index === 0
                  ? "col-span-2 row-span-2 min-h-[190px]"
                  : index < 3
                    ? "min-h-[130px]"
                    : "min-h-[100px]",
              ].join(" ")}
            >
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <p className="font-bold text-white">
                    {position.symbol}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-slate-400">
                    {position.name}
                  </p>
                </div>

                <div>
                  <p className="text-lg font-semibold text-white">
                    {position.portfolioWeight.toFixed(
                      1
                    )}
                    %
                  </p>

                  <p
                    className={[
                      "mt-1",
                      "text-xs",
                      "font-semibold",
                      (
                        position.gainLossPercent ||
                        0
                      ) >= 0
                        ? "text-emerald-100"
                        : "text-rose-100",
                    ].join(" ")}
                  >
                    {position.gainLossPercent ===
                    null
                      ? "—"
                      : `${position.gainLossPercent > 0 ? "+" : ""}${position.gainLossPercent.toFixed(
                          2
                        )}%`}
                  </p>
                </div>
              </div>
            </Link>
          )
        )}

        {visible.length === 0 ? (
          <div className="col-span-full flex min-h-[260px] items-center justify-center rounded-xl border border-dashed border-slate-700">
            <p className="text-sm text-slate-500">
              Holdings will appear after buy transactions are recorded.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
