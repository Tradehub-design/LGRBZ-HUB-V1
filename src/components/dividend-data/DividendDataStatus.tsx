"use client";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
} from "lucide-react";
import type {
  DividendPortfolioSummary,
  DividendProviderId,
} from "@/lib/dividend-data";

type Props = {
  summary:
    DividendPortfolioSummary | null;
  providersUsed:
    DividendProviderId[];
  unresolvedSymbols:
    string[];
  loading?: boolean;
};

export function DividendDataStatus({
  summary,
  providersUsed,
  unresolvedSymbols,
  loading = false,
}: Props) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
        <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-3 h-3 w-64 rounded bg-slate-100 dark:bg-slate-900" />
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <CircleDollarSign className="h-5 w-5" />
          </span>

          <div>
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
              Dividend Intelligence
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Announced, forecast and received income are tracked separately.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <CalendarClock className="h-3.5 w-3.5" />

          {summary?.eventCount || 0} events
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
          <p className="text-xs text-slate-500">
            Announced
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">
            {summary?.announcedEventCount || 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
          <p className="text-xs text-slate-500">
            Forecast
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">
            {summary?.forecastEventCount || 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
          <p className="text-xs text-slate-500">
            Received
          </p>

          <p className="mt-1 text-lg font-bold text-slate-950 dark:text-slate-50">
            {summary?.receivedEventCount || 0}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {providersUsed.map(
          (provider) => (
            <span
              key={provider}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              {provider}
            </span>
          )
        )}

        {providersUsed.length ===
          0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5" />
            No live dividend provider
          </span>
        )}
      </div>

      {unresolvedSymbols.length >
        0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
          Missing provider dividend data for:{" "}
          <strong>
            {unresolvedSymbols.join(
              ", "
            )}
          </strong>
        </div>
      )}
    </section>
  );
}
