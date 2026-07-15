"use client";

import {
  OpenPositionIntelligenceButton,
} from "./OpenPositionIntelligenceButton";


import Link from "next/link";
import {
  ArrowRight,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type {
  HoldingsVisualPosition,
} from "@/lib/holdings-professional/holdingsVisualModels";

type HoldingsMobileCardProps = {
  position:
    HoldingsVisualPosition;

  rank: number;
};

function money(
  value: number,
  currency: string
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

function percent(
  value: number | null,
  positivePrefix = true
): string {
  if (value === null) {
    return "—";
  }

  return `${positivePrefix && value > 0 ? "+" : ""}${value.toFixed(
    2
  )}%`;
}

function tone(
  value: number | null
): string {
  if (
    value === null ||
    value === 0
  ) {
    return "text-slate-300";
  }

  return value > 0
    ? "text-emerald-300"
    : "text-rose-300";
}

export function HoldingsMobileCard({
  position,
  rank,
}: HoldingsMobileCardProps) {
  const ReturnIcon =
    (
      position.gainLossPercent ||
      0
    ) >= 0
      ? TrendingUp
      : TrendingDown;

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-xs font-bold text-slate-400">
            {rank}
          </span>

          <div className="min-w-0">
            <OpenPositionIntelligenceButton
              position={
                position
              }
              className="font-semibold text-white transition hover:text-cyan-300"
            >
              {position.symbol}
            </OpenPositionIntelligenceButton>

            <p className="truncate text-xs text-slate-500">
              {position.name}
            </p>

            <p className="mt-1 truncate text-[10px] text-slate-700">
              {position.sector} ·{" "}
              {position.country}
            </p>
          </div>
        </div>

        <OpenPositionIntelligenceButton
          position={
            position
          }
          ariaLabel={`Open ${position.symbol} position intelligence`}
          className="rounded-lg border border-slate-700 p-2 text-slate-500 transition hover:text-cyan-300"
        >
          <ArrowRight className="h-4 w-4" />
        </OpenPositionIntelligenceButton>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-700">
            Market value
          </p>

          <p className="mt-1 font-semibold text-white">
            {money(
              position.marketValue,
              position.currency
            )}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-700">
            Weight
          </p>

          <p className="mt-1 font-semibold text-white">
            {percent(
              position.portfolioWeight,
              false
            )}
          </p>
        </div>

        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-700">
            Today
          </p>

          <p
            className={[
              "mt-1",
              "font-semibold",
              tone(
                position.dailyChangePercent
              ),
            ].join(" ")}
          >
            {percent(
              position.dailyChangePercent
            )}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-700">
            Total return
          </p>

          <p
            className={[
              "mt-1",
              "inline-flex",
              "items-center",
              "justify-end",
              "gap-1",
              "font-semibold",
              tone(
                position.gainLossPercent
              ),
            ].join(" ")}
          >
            <ReturnIcon className="h-3.5 w-3.5" />

            {percent(
              position.gainLossPercent
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-200">
          <CircleDollarSign className="h-3.5 w-3.5" />

          {money(
            position.annualIncome,
            position.currency
          )}{" "}
          p.a.
        </span>

        <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[9px] font-semibold text-slate-500">
          {position.quoteStatus}
        </span>
      </div>
    </article>
  );
}
