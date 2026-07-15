"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  DatabaseZap,
  XCircle,
} from "lucide-react";
import type {
  MarketDataProviderHealth,
} from "@/lib/market-data";





function providerDisplayValue(
  value: unknown
): string {
  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return "—";
}

function providerText(
  value: unknown,
  fallback = "—"
): string {
  if (
    typeof value === "string"
  ) {
    return value;
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return String(value);
  }

  if (
    typeof value === "boolean"
  ) {
    return value
      ? "Yes"
      : "No";
  }

  return fallback;
}

function providerNumber(
  value: unknown,
  fallback = 0
): number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  )
    ? value
    : fallback;
}


type Props = {
  providers:
    MarketDataProviderHealth[];
  compact?: boolean;
};

export function MarketDataProviderStatus({
  providers,
  compact = false,
}: Props) {
  if (
    providers.length ===
    0
  ) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>
            <p className="font-semibold">
              No market-data provider detected
            </p>

            <p className="mt-1 text-xs leading-5 opacity-80">
              Add a supported server-side API key to the Vercel environment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    const configured =
      providers.filter(
        (provider) =>
          provider.configured
      );

    const available =
      configured.filter(
        (provider) =>
          provider.available
      );

    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
        <DatabaseZap className="h-3.5 w-3.5" />

        {available.length}/
        {configured.length} providers available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {providers.map(
        (provider) => {
          const Icon =
            !provider.configured
              ? AlertTriangle
              : provider.available
                ? CheckCircle2
                : XCircle;

          return (
            <article
              key={
                provider.id
              }
              className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span
                    className={`rounded-xl p-2 ${
                      !provider.configured
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                        : provider.available
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                      {providerText(provider.name)}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {!provider.configured
                        ? "API key not configured"
                        : provider.available
                          ? "Provider available"
                          : "Provider currently unavailable"}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  {provider.successRate.toFixed(
                    0
                  )}
                  % success
                </span>
              </div>

              <div className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                  <p className="text-slate-500">
                    Requests
                  </p>

                  <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">
                    {provider.requestCount}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                  <p className="text-slate-500">
                    Latency
                  </p>

                  <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">
                    {provider.lastLatencyMs ===
                    null
                      ? "—"
                      : `${provider.lastLatencyMs} ms`}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                  <p className="text-slate-500">
                    Last success
                  </p>

                  <p className="mt-1 flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
                    <Clock3 className="h-3.5 w-3.5" />

                    {provider.lastSuccessAt
                      ? new Date(
                          provider.lastSuccessAt
                        ).toLocaleTimeString(
                          "en-AU",
                          {
                            hour:
                              "2-digit",
                            minute:
                              "2-digit",
                          }
                        )
                      : "—"}
                  </p>
                </div>
              </div>

              {provider.lastError && (
                <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/20 dark:text-red-300">
                  {providerText(provider.lastError)}
                </p>
              )}
            </article>
          );
        }
      )}
    </div>
  );
}
