"use client";

import {
  Inbox,
} from "lucide-react";
import {
  DashboardSectionCardProps,
} from "./dashboardV2Types";

function sizeClasses(
  size:
    DashboardSectionCardProps["size"]
) {
  if (
    size === "sm"
  ) {
    return "xl:col-span-3";
  }

  if (
    size === "md"
  ) {
    return "xl:col-span-4";
  }

  if (
    size === "lg"
  ) {
    return "xl:col-span-6";
  }

  if (
    size === "xl"
  ) {
    return "xl:col-span-8";
  }

  return "xl:col-span-12";
}

function DashboardSectionLoading() {
  return (
    <div className="space-y-3">
      <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 w-3/5 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
    </div>
  );
}

export function DashboardSectionCard({
  id,
  title,
  eyebrow,
  description,
  icon: Icon,
  action,
  children,
  loading = false,
  empty = false,
  emptyTitle =
    "No data available",
  emptyDescription =
    "This section will populate when the ledger contains the required information.",
  size = "full",
  className = "",
  contentClassName = "",
}: DashboardSectionCardProps) {
  return (
    <section
      id={id}
      className={`min-w-0 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 ${sizeClasses(
        size
      )} ${className}`}
    >
      <header className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-900 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span className="mt-0.5 rounded-xl bg-slate-100 p-2 text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              <Icon className="h-4 w-4" />
            </span>
          )}

          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {eyebrow}
              </p>
            )}

            <h2 className="mt-0.5 text-base font-semibold text-slate-950 dark:text-slate-50">
              {title}
            </h2>

            {description && (
              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </header>

      <div
        className={`p-5 ${contentClassName}`}
      >
        {loading ? (
          <DashboardSectionLoading />
        ) : empty ? (
          <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center dark:border-slate-700">
            <Inbox className="mx-auto h-7 w-7 text-slate-400" />

            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
              {emptyTitle}
            </p>

            <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
              {emptyDescription}
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
