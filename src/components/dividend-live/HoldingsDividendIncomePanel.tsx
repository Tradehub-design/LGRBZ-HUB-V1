"use client";

import {
  useMemo,
} from "react";
import {
  CalendarDays,
  Coins,
  RefreshCcw,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  useLiveMarketQuotes,
} from "@/hooks/useLiveMarketQuotes";
import {
  calculateLiveDividendSynchronisation,
  normaliseLiveDividendHolding,
} from "@/lib/market-data/client/liveDividendSynchronisation";

type HoldingsDividendIncomePanelProps = {
  holdings: readonly unknown[];
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
    return "Not available";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Not available";
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

export function HoldingsDividendIncomePanel({
  holdings: rawHoldings,
}: HoldingsDividendIncomePanelProps) {
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
          events: [],
          quoteBySymbol:
            live.quoteBySymbol,
        }),
      [
        holdings,
        live.quoteBySymbol,
      ]
    );

  const dividendHoldings =
    result.holdings.filter(
      (
        holding
      ) =>
        holding.annualIncome > 0
    );

  if (holdings.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522]">
      <div className="flex flex-col gap-3 border-b border-slate-800 bg-gradient-to-r from-emerald-500/10 to-transparent p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Holdings Income Intelligence
          </p>

          <h2 className="mt-2 text-xl font-semibold text-white">
            Live Dividend Income by Holding
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Forward income, current yield and yield on cost using live market prices.
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

      <div className="grid gap-3 border-b border-slate-800 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-xs text-slate-400">
            Annual income
          </p>

          <p className="mt-2 text-xl font-semibold text-emerald-200">
            {money(
              result.totals.projectedAnnualIncome
            )}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-xs text-slate-400">
            Current yield
          </p>

          <p className="mt-2 text-xl font-semibold text-white">
            {percent(
              result.totals.currentPortfolioYield
            )}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-xs text-slate-400">
            Yield on cost
          </p>

          <p className="mt-2 text-xl font-semibold text-white">
            {percent(
              result.totals.portfolioYieldOnCost
            )}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-4">
          <p className="text-xs text-slate-400">
            Dividend holdings
          </p>

          <p className="mt-2 text-xl font-semibold text-white">
            {result.totals.dividendHoldingCount}
          </p>
        </div>
      </div>

      <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
        {dividendHoldings.map(
          (
            holding
          ) => (
            <article
              key={holding.symbol}
              className="rounded-xl border border-slate-800 bg-slate-950/45 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">
                    {holding.symbol}
                  </p>

                  <p className="mt-0.5 max-w-[220px] truncate text-xs text-slate-500">
                    {holding.name}
                  </p>
                </div>

                {holding.dividendCut ? (
                  <TrendingDown className="h-4 w-4 text-rose-300" />
                ) : holding.dividendIncrease ? (
                  <TrendingUp className="h-4 w-4 text-emerald-300" />
                ) : (
                  <Coins className="h-4 w-4 text-emerald-300" />
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Annual income
                  </p>

                  <p className="mt-1 font-semibold text-emerald-200">
                    {money(
                      holding.annualIncome,
                      holding.currency
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Contribution
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {percent(
                      holding.incomeContributionPercent
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Current yield
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {percent(
                      holding.currentYield
                    )}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    Yield on cost
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {percent(
                      holding.yieldOnCost
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-800 pt-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CalendarDays className="h-3.5 w-3.5 text-sky-300" />

                  Next payment{" "}
                  {dateLabel(
                    holding.nextPaymentDate
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between gap-3 text-[11px]">
                  <span className="text-slate-500">
                    {holding.dividendFrequency.replaceAll(
                      "_",
                      " "
                    )}
                  </span>

                  <span className="font-semibold text-slate-300">
                    {holding.confidenceScore.toFixed(
                      0
                    )}
                    /100 confidence
                  </span>
                </div>
              </div>
            </article>
          )
        )}

        {dividendHoldings.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-slate-700 p-6 text-center">
            <Coins className="mx-auto h-7 w-7 text-slate-600" />

            <p className="mt-2 text-sm font-medium text-slate-300">
              No dividend-paying holdings were detected
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Holdings remain visible elsewhere while dividend data is refreshed.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
