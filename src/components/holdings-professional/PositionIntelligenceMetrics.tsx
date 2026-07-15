"use client";

import {
  BarChart3,
  CircleDollarSign,
  Database,
  Gauge,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import type {
  PositionIntelligenceMetric,
  PositionIntelligenceSummary,
} from "@/lib/holdings-professional/positionIntelligenceModels";

type PositionIntelligenceMetricsProps = {
  summary:
    PositionIntelligenceSummary;
};

function toneClass(
  tone:
    PositionIntelligenceMetric["tone"]
): string {
  if (tone === "POSITIVE") {
    return "text-emerald-300";
  }

  if (tone === "NEGATIVE") {
    return "text-rose-300";
  }

  if (tone === "INFORMATION") {
    return "text-cyan-200";
  }

  return "text-white";
}

function iconForMetric(
  key: string
) {
  if (
    key === "MARKET_VALUE" ||
    key === "COST_BASIS"
  ) {
    return WalletCards;
  }

  if (
    key === "UNREALISED_RETURN" ||
    key === "TOTAL_RETURN"
  ) {
    return BarChart3;
  }

  if (
    key === "DAILY_CHANGE"
  ) {
    return TrendingUp;
  }

  if (
    key === "ANNUAL_INCOME" ||
    key === "YIELD_ON_COST"
  ) {
    return CircleDollarSign;
  }

  if (
    key === "QUOTE_QUALITY"
  ) {
    return Database;
  }

  return Gauge;
}

export function PositionIntelligenceMetrics({
  summary,
}: PositionIntelligenceMetricsProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {summary.metrics.map(
        metric => {
          const Icon =
            iconForMetric(
              metric.key
            );

          const TrendIcon =
            metric.tone ===
            "NEGATIVE"
              ? TrendingDown
              : TrendingUp;

          return (
            <article
              key={metric.key}
              className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {metric.label}
                  </p>

                  <p
                    className={[
                      "mt-2",
                      "text-xl",
                      "font-semibold",
                      toneClass(
                        metric.tone
                      ),
                    ].join(" ")}
                  >
                    {metric.value}
                  </p>
                </div>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-400">
                  <Icon className="h-4 w-4" />
                </span>
              </div>

              {metric.detail ? (
                <p
                  className={[
                    "mt-3",
                    "inline-flex",
                    "items-center",
                    "gap-1",
                    "text-[11px]",
                    metric.tone ===
                      "POSITIVE"
                      ? "text-emerald-300/75"
                      : metric.tone ===
                          "NEGATIVE"
                        ? "text-rose-300/75"
                        : "text-slate-600",
                  ].join(" ")}
                >
                  {metric.tone ===
                    "POSITIVE" ||
                  metric.tone ===
                    "NEGATIVE" ? (
                    <TrendIcon className="h-3 w-3" />
                  ) : null}

                  {metric.detail}
                </p>
              ) : null}
            </article>
          );
        }
      )}
    </section>
  );
}
