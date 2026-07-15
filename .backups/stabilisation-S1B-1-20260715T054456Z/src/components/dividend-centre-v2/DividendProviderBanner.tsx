"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Database,
  History,
  RadioTower,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type {
  DividendIntelligenceResponse,
  DividendProviderId,
} from "@/lib/dividend-data";

type Props = {
  data: DividendIntelligenceResponse;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

type ProviderPresentation = {
  label: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  className: string;
};

const PROVIDER_PRESENTATION:
  Partial<
    Record<
      DividendProviderId,
      ProviderPresentation
    >
  > = {
    ledger: {
      label:
        "Portfolio Ledger",
      description:
        "Historical cash dividends imported from your transactions.",
      icon:
        History,
      className:
        "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/30 dark:text-sky-300",
    },

    forecast: {
      label:
        "Forecast Engine",
      description:
        "Estimated future payments calculated from portfolio data.",
      icon:
        Sparkles,
      className:
        "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-300",
    },

    manual: {
      label:
        "Manual Data",
      description:
        "Dividend information entered manually.",
      icon:
        Database,
      className:
        "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
    },

    "TWELVE_DATA": {
      label:
        "Twelve Data",
      description:
        "Live and announced market dividend events.",
      icon:
        RadioTower,
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
    },

    finnhub: {
      label:
        "Finnhub",
      description:
        "External company dividend events and market records.",
      icon:
        Cloud,
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
    },

    "ALPHA_VANTAGE": {
      label:
        "Alpha Vantage",
      description:
        "External dividend history and announced events.",
      icon:
        Cloud,
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
    },

    unavailable: {
      label:
        "Unavailable",
      description:
        "A provider could not return dividend information.",
      icon:
        AlertTriangle,
      className:
        "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
    },
  };

function presentationForProvider(
  provider: DividendProviderId
): ProviderPresentation {
  return (
    PROVIDER_PRESENTATION[
      provider
    ] || {
      label:
        provider,
      description:
        "Dividend information source.",
      icon:
        Database,
      className:
        "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300",
    }
  );
}

export function DividendProviderBanner({
  data,
  loading = false,
  refreshing = false,
  onRefresh,
}: Props) {
  if (loading) {
    return (
      <section className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="h-5 w-44 rounded bg-slate-200 dark:bg-slate-800" />

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: 3,
          }).map(
            (
              _,
              index
            ) => (
              <div
                key={index}
                className="h-20 rounded-xl bg-slate-100 dark:bg-slate-900"
              />
            )
          )}
        </div>
      </section>
    );
  }

  const providers =
    Array.from(
      new Set(
        data.providersUsed
      )
    );

  const hasLedger =
    providers.includes(
      "ledger"
    ) ||
    data.summary.receivedEventCount >
      0;

  const hasForecast =
    providers.includes(
      "forecast"
    ) ||
    data.summary.forecastEventCount >
      0;

  const liveProviders =
    providers.filter(
      (provider) =>
        provider !==
          "ledger" &&
        provider !==
          "forecast" &&
        provider !==
          "manual" &&
        provider !==
          "UNAVAILABLE"
    );

  const sourceQuality =
    liveProviders.length >
    0
      ? "Live market data active"
      : hasLedger
        ? "Ledger data active"
        : hasForecast
          ? "Forecast data active"
          : "No dividend source active";

  const sourceDescription =
    liveProviders.length >
    0
      ? "Confirmed provider events are available. Ledger and forecast data remain separated."
      : hasLedger &&
          hasForecast
        ? "Historical receipts are available from your ledger. Future events currently rely on forecasts."
        : hasLedger
          ? "Historical dividend receipts are available. No live future provider events were returned."
          : hasForecast
            ? "Future estimates are available, but no historical ledger dividends were detected."
            : "No dividend events were returned from the ledger, live providers or forecast engine.";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={`shrink-0 rounded-xl p-2.5 ${
              liveProviders.length >
              0
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                : providers.length >
                    0
                  ? "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
            }`}
          >
            {liveProviders.length >
            0 ? (
              <ShieldCheck className="h-5 w-5" />
            ) : providers.length >
              0 ? (
              <Database className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold text-slate-950 dark:text-slate-50">
                Dividend Data Sources
              </h2>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  liveProviders.length >
                  0
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : providers.length >
                        0
                      ? "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                }`}
              >
                {liveProviders.length >
                0 ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}

                {sourceQuality}
              </span>
            </div>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
              {sourceDescription}
            </p>
          </div>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={
              onRefresh
            }
            disabled={
              refreshing
            }
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            {refreshing
              ? "Refreshing"
              : "Refresh Sources"}
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {providers.map(
          (provider) => {
            const presentation =
              presentationForProvider(
                provider
              );

            const Icon =
              presentation.icon;

            return (
              <article
                key={provider}
                className={`rounded-xl border p-3 ${presentation.className}`}
              >
                <div className="flex items-start gap-3">
                  <span className="rounded-lg bg-white/70 p-2 dark:bg-black/20">
                    <Icon className="h-4 w-4" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-bold">
                      {presentation.label}
                    </p>

                    <p className="mt-1 text-[11px] leading-4 opacity-80">
                      {presentation.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          }
        )}

        {providers.length ===
          0 && (
          <article className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
            <div className="flex items-start gap-3">
              <span className="rounded-lg bg-white/70 p-2 dark:bg-black/20">
                <AlertTriangle className="h-4 w-4" />
              </span>

              <div>
                <p className="text-xs font-bold">
                  No active provider
                </p>

                <p className="mt-1 text-[11px] leading-4 opacity-80">
                  Check the portfolio ledger connection and configured live provider keys.
                </p>
              </div>
            </div>
          </article>
        )}
      </div>

      {data.unresolvedSymbols.length >
        0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:text-amber-300">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

            <p>
              Live dividend information could not be resolved for{" "}
              <strong>
                {data.unresolvedSymbols.join(
                  ", "
                )}
              </strong>
              . Historical ledger receipts should still remain visible, while upcoming events may be forecast instead.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
