"use client";

import {
  BellRing,
  ChartNoAxesCombined,
  ListChecks,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  WatchlistSummary,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  summary: WatchlistSummary;
};

const numberFormatter =
  new Intl.NumberFormat(
    "en-AU",
    {
      maximumFractionDigits: 2,
    }
  );

export function WatchlistSummaryCards({
  summary,
}: Props) {
  const cards = [
    {
      label: "Securities",
      value:
        summary.totalSecurities.toLocaleString(
          "en-AU"
        ),
      detail: `${summary.unchanged} unchanged`,
      icon: ListChecks,
    },
    {
      label: "Gainers",
      value:
        summary.gainers.toLocaleString(
          "en-AU"
        ),
      detail: "Positive today",
      icon: TrendingUp,
    },
    {
      label: "Losers",
      value:
        summary.losers.toLocaleString(
          "en-AU"
        ),
      detail: "Negative today",
      icon: TrendingDown,
    },
    {
      label: "Average Move",
      value: `${numberFormatter.format(
        summary.averageChangePercent
      )}%`,
      detail: "Across current view",
      icon: ChartNoAxesCombined,
    },
    {
      label: "Active Alerts",
      value:
        summary.alerts.toLocaleString(
          "en-AU"
        ),
      detail: "Price and event alerts",
      icon: BellRing,
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {card.label}
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                  {card.value}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {card.detail}
                </p>
              </div>

              <span className="rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                <Icon className="h-4 w-4" />
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
