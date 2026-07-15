"use client";

import {
  Activity,
  Building2,
  Globe2,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import type {
  PositionIntelligenceSummary,
} from "@/lib/holdings-professional/positionIntelligenceModels";

type PositionIntelligenceHeaderProps = {
  summary:
    PositionIntelligenceSummary;

  onClose: () => void;
};

function money(
  value: number | null,
  currency: string,
  digits = 2
): string {
  if (value === null) {
    return "—";
  }

  try {
    return new Intl.NumberFormat(
      "en-AU",
      {
        style: "currency",
        currency,
        maximumFractionDigits:
          digits,
      }
    ).format(value);
  } catch {
    return `${currency} ${value.toFixed(
      digits
    )}`;
  }
}

function percent(
  value: number | null
): string {
  if (value === null) {
    return "—";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(
    2
  )}%`;
}

function healthClass(
  score: number
): string {
  if (score >= 85) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-200";
  }

  if (score >= 70) {
    return "border-sky-400/20 bg-sky-400/10 text-sky-200";
  }

  if (score >= 50) {
    return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  }

  return "border-rose-400/20 bg-rose-400/10 text-rose-200";
}

export function PositionIntelligenceHeader({
  summary,
  onClose,
}: PositionIntelligenceHeaderProps) {
  const {
    position,
  } =
    summary;

  const positive =
    (
      position.dailyChangePercent ||
      0
    ) >=
    0;

  const ChangeIcon =
    positive
      ? TrendingUp
      : TrendingDown;

  return (
    <header className="relative overflow-hidden border-b border-slate-800 bg-[#06131f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.13),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.1),transparent_40%)]" />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-lg font-bold text-cyan-200">
            {position.symbol.slice(
              0,
              4
            )}
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1
                id="position-intelligence-title"
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
              >
                {position.symbol}
              </h1>

              <span
                className={[
                  "rounded-full",
                  "border",
                  "px-2.5",
                  "py-1",
                  "text-[10px]",
                  "font-semibold",
                  healthClass(
                    summary.healthScore
                  ),
                ].join(" ")}
              >
                {summary.healthLevel}
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                Rank #{summary.rank} of{" "}
                {summary.holdingCount}
              </span>
            </div>

            <p className="mt-1 truncate text-sm text-slate-400">
              {position.name}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-violet-300" />

                {position.sector}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5 text-sky-300" />

                {position.country}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-300" />

                {position.quoteStatus}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-300" />

                Health{" "}
                {summary.healthScore.toFixed(
                  0
                )}
                /100
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close position intelligence"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 text-slate-400 transition hover:border-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300/40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/[0.035] p-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Current price
            </p>

            <p className="mt-1 text-3xl font-semibold text-white">
              {money(
                summary.currentPrice,
                position.currency,
                4
              )}
            </p>
          </div>

          <div className="sm:text-right">
            <p
              className={[
                "inline-flex",
                "items-center",
                "gap-1.5",
                "text-sm",
                "font-semibold",
                positive
                  ? "text-emerald-300"
                  : "text-rose-300",
              ].join(" ")}
            >
              <ChangeIcon className="h-4 w-4" />

              {money(
                position.dailyChange,
                position.currency
              )}
            </p>

            <p
              className={[
                "mt-1",
                "text-xs",
                positive
                  ? "text-emerald-300/70"
                  : "text-rose-300/70",
              ].join(" ")}
            >
              {percent(
                position.dailyChangePercent
              )} today
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
