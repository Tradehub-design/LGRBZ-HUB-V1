"use client";

import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";
import {
  dashboardFormatMetric,
  dashboardFormatPercentage,
} from "./dashboardV2Formatters";
import {
  DashboardExecutiveMetric,
} from "./dashboardV2Types";

type Props = {
  metric: DashboardExecutiveMetric;
};

function toneClasses(
  tone:
    DashboardExecutiveMetric["tone"]
) {
  if (
    tone === "positive"
  ) {
    return {
      icon:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
      comparison:
        "text-emerald-600 dark:text-emerald-400",
      border:
        "hover:border-emerald-300 dark:hover:border-emerald-800",
    };
  }

  if (
    tone === "negative"
  ) {
    return {
      icon:
        "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
      comparison:
        "text-red-600 dark:text-red-400",
      border:
        "hover:border-red-300 dark:hover:border-red-800",
    };
  }

  if (
    tone === "warning"
  ) {
    return {
      icon:
        "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
      comparison:
        "text-amber-600 dark:text-amber-400",
      border:
        "hover:border-amber-300 dark:hover:border-amber-800",
    };
  }

  if (
    tone === "info"
  ) {
    return {
      icon:
        "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
      comparison:
        "text-blue-600 dark:text-blue-400",
      border:
        "hover:border-blue-300 dark:hover:border-blue-800",
    };
  }

  return {
    icon:
      "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300",
    comparison:
      "text-slate-500",
    border:
      "hover:border-slate-300 dark:hover:border-slate-700",
  };
}

function TrendIcon({
  trend,
}: {
  trend:
    DashboardExecutiveMetric["trend"];
}) {
  if (
    trend === "up"
  ) {
    return (
      <ArrowUpRight className="h-3.5 w-3.5" />
    );
  }

  if (
    trend === "down"
  ) {
    return (
      <ArrowDownRight className="h-3.5 w-3.5" />
    );
  }

  return (
    <Minus className="h-3.5 w-3.5" />
  );
}

export function DashboardExecutiveKpiCard({
  metric,
}: Props) {
  const Icon =
    metric.icon;

  const classes =
    toneClasses(
      metric.tone
    );

  const Component =
    metric.onClick
      ? "button"
      : "article";

  return (
    <Component
      type={
        metric.onClick
          ? "button"
          : undefined
      }
      onClick={
        metric.onClick
      }
      className={`group min-w-0 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition dark:border-slate-800 dark:bg-slate-950 ${classes.border} ${
        metric.onClick
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
            {metric.label}
          </p>

          {metric.loading ? (
            <div className="mt-3 h-8 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
          ) : (
            <p className="mt-2 truncate text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
              {dashboardFormatMetric(
                metric
              )}
            </p>
          )}

          {metric.subtitle && (
            <p className="mt-1 truncate text-xs text-slate-500">
              {metric.subtitle}
            </p>
          )}

          {metric.comparisonValue !==
            null &&
            metric.comparisonValue !==
              undefined && (
              <p
                className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${classes.comparison}`}
              >
                <TrendIcon
                  trend={
                    metric.trend
                  }
                />

                {dashboardFormatPercentage(
                  metric.comparisonValue,
                  2,
                  true
                )}

                {metric.comparisonLabel && (
                  <span className="font-normal text-slate-500">
                    {metric.comparisonLabel}
                  </span>
                )}
              </p>
            )}
        </div>

        {Icon && (
          <span
            className={`rounded-xl p-2 ${classes.icon}`}
          >
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>

      {metric.onClick && (
        <div className="mt-3 flex justify-end">
          <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
        </div>
      )}
    </Component>
  );
}
