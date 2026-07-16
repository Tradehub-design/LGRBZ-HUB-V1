"use client";

import {
  BarChart3,
  CalendarRange,
  Coins,
  Landmark,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import {
  usePortfolioDividendEngine,
} from "@/core/portfolio-engine/client/usePortfolioDividendEngine";

import {
  selectDividendHoldingSummaries,
  selectDividendReconciliation,
  selectForecastDividendEvents,
} from "@/core/portfolio-engine/client/dividend-selectors";

import type {
  PortfolioDividendHoldingSummary,
  PortfolioDividendMonth,
} from "@/core/portfolio-engine/dividends/contracts";

function money(
  value: number | null,
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-AU",
    {
      style: "currency",
      currency: "AUD",
      maximumFractionDigits: 2,
    },
  ).format(value);
}

function percent(
  value: number | null,
): string {
  if (
    value === null ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `${value.toFixed(2)}%`;
}

function dateLabel(
  value: string | null,
): string {
  if (!value) {
    return "—";
  }

  const timestamp =
    Date.parse(value);

  if (!Number.isFinite(timestamp)) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en-AU",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(
    new Date(timestamp),
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <div className="flex items-center gap-2 text-cyan-300">
        <span className="[&>svg]:h-4 [&>svg]:w-4">
          {icon}
        </span>

        <p className="text-xs uppercase tracking-[0.18em]">
          {label}
        </p>
      </div>

      <p className="mt-3 text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {detail}
      </p>
    </div>
  );
}

function maximumMonthIncome(
  months: PortfolioDividendMonth[],
): number {
  return Math.max(
    0,
    ...months.map(
      (month) =>
        month.announcedIncomeAud +
        month.forecastIncomeAud,
    ),
  );
}

function MonthlyForecast({
  months,
}: {
  months: PortfolioDividendMonth[];
}) {
  const maximum =
    maximumMonthIncome(
      months,
    );

  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Monthly Income Forecast
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Announced and non-duplicated forecast income over the next twelve
          months.
        </p>
      </div>

      {months.length === 0 ? (
        <p className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
          No monthly forecast is available.
        </p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {months.map(
            (month) => {
              const forwardIncome =
                month.announcedIncomeAud +
                month.forecastIncomeAud;

              const width =
                maximum > 0
                  ? Math.max(
                      4,
                      (
                        forwardIncome /
                        maximum
                      ) *
                        100,
                    )
                  : 0;

              return (
                <div
                  key={month.month}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">
                      {month.label}
                    </p>

                    <p className="text-sm font-semibold text-cyan-200">
                      {money(
                        forwardIncome,
                      )}
                    </p>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{
                        width:
                          `${Math.min(
                            100,
                            width,
                          )}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                    <p>
                      Announced:{" "}
                      <span className="text-slate-300">
                        {money(
                          month.announcedIncomeAud,
                        )}
                      </span>
                    </p>

                    <p>
                      Forecast:{" "}
                      <span className="text-slate-300">
                        {money(
                          month.forecastIncomeAud,
                        )}
                      </span>
                    </p>

                    <p>
                      Franking:{" "}
                      <span className="text-emerald-300">
                        {money(
                          month.frankingCreditsAud,
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}

function HoldingForecastTable({
  holdings,
}: {
  holdings:
    PortfolioDividendHoldingSummary[];
}) {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Forecast by Holding
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          Holding income, yield and yield on cost consume the canonical
          quantity, market value and transaction-derived cost base.
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="px-3 py-2">
                Holding
              </th>

              <th className="px-3 py-2 text-right">
                Quantity
              </th>

              <th className="px-3 py-2 text-right">
                Market Value
              </th>

              <th className="px-3 py-2 text-right">
                Cost Base
              </th>

              <th className="px-3 py-2 text-right">
                Forward Income
              </th>

              <th className="px-3 py-2 text-right">
                Announced
              </th>

              <th className="px-3 py-2 text-right">
                Forecast
              </th>

              <th className="px-3 py-2 text-right">
                Yield
              </th>

              <th className="px-3 py-2 text-right">
                Yield on Cost
              </th>

              <th className="px-3 py-2">
                Next Ex-date
              </th>

              <th className="px-3 py-2">
                Next Payment
              </th>

              <th className="px-3 py-2 text-right">
                Franking
              </th>
            </tr>
          </thead>

          <tbody>
            {holdings.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="px-3 py-8 text-center text-slate-400"
                >
                  No dividend-paying holdings were resolved.
                </td>
              </tr>
            ) : (
              holdings.map(
                (holding) => (
                  <tr
                    key={holding.holdingId}
                    className="border-t border-white/10 text-slate-200"
                  >
                    <td className="px-3 py-3">
                      <p className="font-semibold text-white">
                        {holding.displaySymbol ||
                          holding.symbol}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {holding.quoteSource}
                      </p>
                    </td>

                    <td className="px-3 py-3 text-right">
                      {holding.quantity.toLocaleString(
                        "en-AU",
                        {
                          maximumFractionDigits: 8,
                        },
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {money(
                        holding.marketValueAud,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {money(
                        holding.costBaseAud,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right font-semibold text-white">
                      {money(
                        holding.forwardTwelveMonthIncomeAud,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right text-cyan-300">
                      {money(
                        holding.announcedIncomeAud,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right text-amber-300">
                      {money(
                        holding.forecastIncomeAud,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {percent(
                        holding.dividendYieldPercent,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {percent(
                        holding.yieldOnCostPercent,
                      )}
                    </td>

                    <td className="px-3 py-3">
                      {dateLabel(
                        holding.nextExDate,
                      )}
                    </td>

                    <td className="px-3 py-3">
                      {dateLabel(
                        holding.nextPaymentDate,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right text-emerald-300">
                      {money(
                        holding.projectedFrankingCreditsAud,
                      )}
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function DividendForecastPage() {
  const {
    dividendSnapshot,
    status,
    loading,
    refreshing,
    error,
    forceRefresh,
  } = usePortfolioDividendEngine();

  const totals =
    dividendSnapshot.totals;

  const holdingSummaries =
    selectDividendHoldingSummaries(
      dividendSnapshot,
    );

  const forecastEvents =
    selectForecastDividendEvents(
      dividendSnapshot,
    );

  const reconciliation =
    selectDividendReconciliation(
      dividendSnapshot,
    );

  const busy =
    loading ||
    refreshing;

  async function refreshForecast() {
    await forceRefresh();
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            Income Engine
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Dividend Forecast
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Forward income generated from eligible holdings, announced
            distributions and non-duplicated forecast events.
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            void refreshForecast();
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={
              busy
                ? "h-4 w-4 animate-spin"
                : "h-4 w-4"
            }
          />

          {busy
            ? "Refreshing…"
            : "Refresh forecast"}
        </button>
      </div>

      <section
        className={
          reconciliation.valid &&
          status === "READY"
            ? "rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-5 py-4"
            : status === "ERROR"
              ? "rounded-2xl border border-rose-500/25 bg-rose-500/5 px-5 py-4"
              : "rounded-2xl border border-amber-500/25 bg-amber-500/5 px-5 py-4"
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">
              {reconciliation.valid
                ? "Dividend forecast reconciles with its underlying events and holdings."
                : `${reconciliation.issues.length} dividend reconciliation issue${
                    reconciliation.issues.length === 1
                      ? ""
                      : "s"
                  } detected.`}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Status: {status}. Forecast events:{" "}
              {forecastEvents.length}. Income-producing holdings:{" "}
              {totals.incomeHoldingCount}/{totals.holdingCount}.
            </p>

            {error ? (
              <p className="mt-2 text-xs text-rose-300">
                {error}
              </p>
            ) : null}
          </div>

          <p className="text-xs text-slate-500">
            Snapshot: {dividendSnapshot.snapshotId}
          </p>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<WalletCards />}
          label="Annual Forecast"
          value={money(
            totals.forwardTwelveMonthIncomeAud,
          )}
          detail={`${money(
            totals.announcedForwardIncomeAud,
          )} announced · ${money(
            totals.forecastForwardIncomeAud,
          )} forecast`}
        />

        <StatCard
          icon={<CalendarRange />}
          label="Monthly Average"
          value={money(
            totals.monthlyForwardIncomeAud,
          )}
          detail="Forward twelve-month income divided by twelve"
        />

        <StatCard
          icon={<TrendingUp />}
          label="Portfolio Yield"
          value={percent(
            totals.portfolioDividendYieldPercent,
          )}
          detail={`Forward income ÷ ${money(
            totals.securitiesMarketValueAud,
          )} market value`}
        />

        <StatCard
          icon={<Landmark />}
          label="Yield on Cost"
          value={percent(
            totals.portfolioYieldOnCostPercent,
          )}
          detail={`Forward income ÷ ${money(
            totals.openCostBaseAud,
          )} cost base`}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard
          icon={<Coins />}
          label="Franking Credits"
          value={money(
            totals.projectedFrankingCreditsAud,
          )}
          detail="Projected credits from eligible franked distributions"
        />

        <StatCard
          icon={<ShieldCheck />}
          label="Withholding Tax"
          value={money(
            totals.estimatedWithholdingTaxAud,
          )}
          detail="Estimated foreign withholding on forward income"
        />

        <StatCard
          icon={<BarChart3 />}
          label="Forecast Events"
          value={String(
            totals.announcedEventCount +
              totals.forecastEventCount,
          )}
          detail={`${totals.announcedEventCount} announced · ${totals.forecastEventCount} forecast`}
        />
      </div>

      <MonthlyForecast
        months={
          dividendSnapshot.monthlyForecast
        }
      />

      <HoldingForecastTable
        holdings={holdingSummaries}
      />
    </div>
  );
}
