"use client";

import type {
  ComponentType,
} from "react";
import {
  BellRing,
  Crosshair,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  createWatchlistIntelligenceSummary,
} from "@/lib/watchlist/watchlistIntelligence";
import {
  WatchlistSecurity,
} from "@/lib/watchlist/watchlistTypes";

type Props = {
  securities: WatchlistSecurity[];
};

type CardProps = {
  icon: ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
  detail: string;
  tone:
    | "positive"
    | "negative"
    | "warning"
    | "neutral";
};

function toneClasses(
  tone: CardProps["tone"]
) {
  if (
    tone === "positive"
  ) {
    return {
      icon:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
      value:
        "text-emerald-700 dark:text-emerald-300",
    };
  }

  if (
    tone === "negative"
  ) {
    return {
      icon:
        "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
      value:
        "text-red-700 dark:text-red-300",
    };
  }

  if (
    tone === "warning"
  ) {
    return {
      icon:
        "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
      value:
        "text-amber-700 dark:text-amber-300",
    };
  }

  return {
    icon:
      "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
    value:
      "text-slate-950 dark:text-slate-50",
  };
}

function IntelligenceCard({
  icon: Icon,
  label,
  value,
  detail,
  tone,
}: CardProps) {
  const classes =
    toneClasses(tone);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p
            className={`mt-2 text-2xl font-bold tracking-tight ${classes.value}`}
          >
            {value}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {detail}
          </p>
        </div>

        <span
          className={`rounded-xl p-2 ${classes.icon}`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}

export function WatchlistIntelligenceCards({
  securities,
}: Props) {
  const summary =
    createWatchlistIntelligenceSummary(
      securities
    );

  const averageMove =
    `${summary.averageMove >= 0 ? "+" : ""}${summary.averageMove.toFixed(
      2
    )}%`;

  const targetUpside =
    summary.averageTargetUpside ===
    null
      ? "—"
      : `${summary.averageTargetUpside >= 0 ? "+" : ""}${summary.averageTargetUpside.toFixed(
          1
        )}%`;

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <IntelligenceCard
        icon={TrendingUp}
        label="Today's Gainers"
        value={String(
          summary.gainers
        )}
        detail={
          summary.topGainer
            ? `${summary.topGainer.symbol} +${summary.topGainer.changePercent.toFixed(
                2
              )}%`
            : "No positive movers"
        }
        tone="positive"
      />

      <IntelligenceCard
        icon={TrendingDown}
        label="Today's Decliners"
        value={String(
          summary.decliners
        )}
        detail={
          summary.topDecliner
            ? `${summary.topDecliner.symbol} ${summary.topDecliner.changePercent.toFixed(
                2
              )}%`
            : "No negative movers"
        }
        tone={
          summary.decliners >
          0
            ? "negative"
            : "neutral"
        }
      />

      <IntelligenceCard
        icon={Crosshair}
        label="Average Move"
        value={
          averageMove
        }
        detail={`${summary.gainers} up · ${summary.decliners} down · ${summary.unchanged} flat`}
        tone={
          summary.averageMove >
          0
            ? "positive"
            : summary.averageMove <
                0
              ? "negative"
              : "neutral"
        }
      />

      <IntelligenceCard
        icon={Target}
        label="Average Target Upside"
        value={
          targetUpside
        }
        detail={`${summary.targetCount} securities with targets`}
        tone={
          (
            summary.averageTargetUpside ??
            0
          ) >= 10
            ? "positive"
            : (
                  summary.averageTargetUpside ??
                  0
                ) <
                0
              ? "negative"
              : "neutral"
        }
      />

      <IntelligenceCard
        icon={BellRing}
        label="Active Alerts"
        value={String(
          summary.activeAlertCount
        )}
        detail={`${summary.buySignalCount} opportunity signals · ${summary.sellSignalCount} risk signals`}
        tone={
          summary.activeAlertCount >
          0
            ? "warning"
            : "neutral"
        }
      />
    </section>
  );
}
