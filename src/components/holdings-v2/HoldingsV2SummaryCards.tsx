"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";
import {
  HoldingsV2SummaryMetric,
} from "@/lib/holdings-v2/holdingsV2Types";
import {
  holdingsV2FormatCurrency,
  holdingsV2FormatNumber,
  holdingsV2FormatPercentage,
} from "@/lib/holdings-v2/holdingsV2Formatters";

type Props = {
  metrics: HoldingsV2SummaryMetric[];
  loading?: boolean;
};

function formatMetric(
  metric: HoldingsV2SummaryMetric
) {
  if (
    metric.value ===
      null ||
    metric.value ===
      undefined
  ) {
    return "—";
  }

  if (
    typeof metric.value ===
    "string"
  ) {
    return metric.value;
  }

  if (
    metric.format ===
    "currency"
  ) {
    return holdingsV2FormatCurrency(
      metric.value,
      metric.currency ??
        "AUD",
      metric.decimals ??
        0
    );
  }

  if (
    metric.format ===
    "percentage"
  ) {
    return holdingsV2FormatPercentage(
      metric.value,
      metric.decimals ??
        2,
      true
    );
  }

  return holdingsV2FormatNumber(
    metric.value,
    metric.decimals ??
      0
  );
}

function toneClass(
  tone:
    HoldingsV2SummaryMetric["tone"]
) {
  if (
    tone === "positive"
  ) {
    return {
      border:
        "hover:border-emerald-300 dark:hover:border-emerald-800",
      value:
        "text-emerald-600 dark:text-emerald-400",
    };
  }

  if (
    tone === "negative"
  ) {
    return {
      border:
        "hover:border-red-300 dark:hover:border-red-800",
      value:
        "text-red-600 dark:text-red-400",
    };
  }

  if (
    tone === "warning"
  ) {
    return {
      border:
        "hover:border-amber-300 dark:hover:border-amber-800",
      value:
        "text-amber-600 dark:text-amber-400",
    };
  }

  return {
    border:
      "hover:border-slate-300 dark:hover:border-slate-700",
    value:
      "text-slate-950 dark:text-slate-50",
  };
}

export function HoldingsV2SummaryCards({
  metrics,
  loading = false,
}: Props) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {metrics.map(
        (metric) => {
          const tone =
            toneClass(
              metric.tone
            );

          const comparison =
            metric.comparison;

          const Icon =
            comparison ===
              null ||
            comparison ===
              undefined ||
            comparison === 0
              ? Minus
              : comparison > 0
                ? ArrowUpRight
                : ArrowDownRight;

          return (
            <article
              key={
                metric.id
              }
              className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition dark:border-slate-800 dark:bg-slate-950 ${tone.border}`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                {metric.label}
              </p>

              {loading ? (
                <div className="mt-3 h-8 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              ) : (
                <p
                  className={`mt-2 truncate text-2xl font-bold tracking-tight ${tone.value}`}
                >
                  {formatMetric(
                    metric
                  )}
                </p>
              )}

              {comparison !==
                null &&
                comparison !==
                  undefined && (
                  <p
                    className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${
                      comparison > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : comparison < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-slate-500"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />

                    {holdingsV2FormatPercentage(
                      comparison,
                      2,
                      true
                    )}
                  </p>
                )}

              {metric.subtitle && (
                <p className="mt-1 truncate text-xs text-slate-500">
                  {metric.subtitle}
                </p>
              )}
            </article>
          );
        }
      )}
    </section>
  );
}
