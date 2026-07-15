"use client";

import {
  useMemo,
} from "react";
import {
  CalendarDays,
  Coins,
  Gauge,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import {
  useLiveMarketQuotes,
} from "@/hooks/useLiveMarketQuotes";
import {
  calculateLiveDividendSynchronisation,
  normaliseLiveDividendEvent,
  normaliseLiveDividendHolding,
} from "@/lib/market-data/client/liveDividendSynchronisation";

type DashboardLiveDividendPanelProps = {
  holdings: readonly unknown[];
  events?: readonly unknown[];
};

function money(
  value: number | null | undefined,
  currency = "AUD"
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency,
      maximumFractionDigits:
        Math.abs(value) < 100
          ? 2
          : 0,
    }
  ).format(value);
}

function percent(
  value: number | null | undefined
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `${value.toFixed(
    2
  )}%`;
}

function dateLabel(
  value: string | null
): string {
  if (!value) {
    return "Date unavailable";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  ).format(date);
}

export function DashboardLiveDividendPanel({
  holdings: rawHoldings,
  events: rawEvents = [],
}: DashboardLiveDividendPanelProps) {
  const holdings =
    useMemo(
      () =>
        rawHoldings
          .map(
            normaliseLiveDividendHolding
          )
          .filter(
            (
              holding
            ): holding is NonNullable<
              ReturnType<
                typeof normaliseLiveDividendHolding
              >
            > =>
              Boolean(holding)
          ),
      [rawHoldings]
    );

  const events =
    useMemo(
      () =>
        rawEvents
          .map(
            (
              event,
              index
            ) =>
              normaliseLiveDividendEvent(
                event,
                index
              )
          )
          .filter(
            (
              event
            ): event is NonNullable<
              ReturnType<
                typeof normaliseLiveDividendEvent
              >
            > =>
              Boolean(event)
          ),
      [rawEvents]
    );

  const symbols =
    useMemo(
      () =>
        holdings.map(
          (
            holding
          ) =>
            holding.symbol
        ),
      [holdings]
    );

  const live =
    useLiveMarketQuotes(
      symbols,
      {
        enabled:
          symbols.length > 0,

        refreshOnMount: true,
        refreshWhenVisible: true,
        refreshWhenOnline: true,

        pauseWhenHidden: true,
        pauseWhenOffline: true,

        allowDelayed: true,
        allowIndicative: false,
        allowStale: true,
        allowExpiredFallback: true,

        minimumQualityScore: 40,
        maximumProviderAttempts: 4,

        marketOpenIntervalMs: 120_000,
        marketClosedIntervalMs: 900_000,
        backgroundIntervalMs: 300_000,

        concurrency: 6,
        timeoutMs: 10_000,
      }
    );

  const result =
    useMemo(
      () =>
        calculateLiveDividendSynchronisation({
          holdings,
          events,
          quoteBySymbol:
            live.quoteBySymbol,
        }),
      [
        events,
        holdings,
        live.quoteBySymbol,
      ]
    );

  if (holdings.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522]">
      <div className="flex flex-col gap-3 border-b border-slate-800 bg-gradient-to-r from-emerald-500/10 to-transparent p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Live Income Overview
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Portfolio Dividend Income
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Dashboard income metrics synchronised with current holdings and live prices.
          </p>
        </div>

        <button
          type="button"
          disabled={
            live.loading ||
            live.refreshing ||
            !live.online
          }
          onClick={() => {
            void live.refresh();
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-200 disabled:opacity-50"
        >
          <RefreshCcw
            className={[
              "h-3.5",
              "w-3.5",
              live.loading ||
              live.refreshing
                ? "animate-spin"
                : "",
            ].join(" ")}
          />

          Refresh income
        </button>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Annual income
            </span>

            <Coins className="h-4 w-4 text-emerald-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-emerald-200">
            {money(
              result.totals.projectedAnnualIncome
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {money(
              result.totals.projectedMonthlyIncome
            )}{" "}
            monthly
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Forward yield
            </span>

            <Gauge className="h-4 w-4 text-cyan-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {percent(
              result.totals.forwardPortfolioYield
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Live-priced portfolio value
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Income this quarter
            </span>

            <CalendarDays className="h-4 w-4 text-sky-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {money(
              result.totals.incomeNext90Days
            )}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Next 90 calendar days
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Next payment
            </span>

            <CalendarDays className="h-4 w-4 text-violet-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {result.nextDividend
              ? money(
                  result.nextDividend.projectedNetAmount,
                  result.nextDividend.currency
                )
              : "—"}
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {result.nextDividend
              ? `${result.nextDividend.symbol} · ${dateLabel(
                  result.nextDividend.paymentDate
                )}`
              : "No dated payment"}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Income health
            </span>

            <ShieldCheck className="h-4 w-4 text-amber-300" />
          </div>

          <p className="mt-2 text-xl font-semibold text-white">
            {result.totals.dividendHealthScore.toFixed(
              0
            )}
            /100
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            {result.totals.averageForecastConfidence.toFixed(
              0
            )}
            % forecast confidence
          </p>
        </div>
      </div>
    </section>
  );
}
