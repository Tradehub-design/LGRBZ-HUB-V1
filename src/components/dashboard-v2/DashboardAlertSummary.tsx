"use client";

import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  dashboardFormatDateTime,
} from "./dashboardV2Formatters";
import {
  DashboardAlertItem,
} from "./dashboardV2Types";

type Props = {
  alerts: DashboardAlertItem[];
  maxItems?: number;
};

function alertTone(
  tone:
    DashboardAlertItem["tone"]
) {
  if (
    tone === "critical"
  ) {
    return {
      icon:
        AlertCircle,
      wrapper:
        "border-red-200 bg-red-50/70 dark:border-red-900 dark:bg-red-950/20",
      iconClass:
        "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
    };
  }

  if (
    tone === "warning"
  ) {
    return {
      icon:
        AlertTriangle,
      wrapper:
        "border-amber-200 bg-amber-50/70 dark:border-amber-900 dark:bg-amber-950/20",
      iconClass:
        "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    };
  }

  if (
    tone === "success"
  ) {
    return {
      icon:
        CheckCircle2,
      wrapper:
        "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20",
      iconClass:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    };
  }

  return {
    icon:
      Info,
    wrapper:
      "border-blue-200 bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20",
    iconClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300",
  };
}

function AlertContent({
  alert,
}: {
  alert: DashboardAlertItem;
}) {
  const classes =
    alertTone(
      alert.tone
    );

  const Icon =
    classes.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border p-4 ${classes.wrapper}`}
    >
      <span
        className={`rounded-xl p-2 ${classes.iconClass}`}
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
          {alert.title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {alert.message}
        </p>

        {alert.timestamp && (
          <p className="mt-2 text-[11px] text-slate-400">
            {dashboardFormatDateTime(
              alert.timestamp
            )}
          </p>
        )}
      </div>

      {alert.actionLabel &&
        alert.onAction && (
          <button
            type="button"
            onClick={
              alert.onAction
            }
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          >
            {alert.actionLabel}
          </button>
        )}
    </div>
  );
}

export function DashboardAlertSummary({
  alerts,
  maxItems = 5,
}: Props) {
  if (
    alerts.length ===
    0
  ) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-10 text-center dark:border-slate-700">
        <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-500" />

        <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
          No active alerts
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Portfolio data quality and risk checks are clear.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts
        .slice(
          0,
          maxItems
        )
        .map(
          (alert) =>
            alert.href ? (
              <Link
                key={
                  alert.id
                }
                href={
                  alert.href
                }
                className="block transition hover:-translate-y-0.5"
              >
                <AlertContent
                  alert={
                    alert
                  }
                />
              </Link>
            ) : (
              <AlertContent
                key={
                  alert.id
                }
                alert={
                  alert
                }
              />
            )
        )}
    </div>
  );
}
