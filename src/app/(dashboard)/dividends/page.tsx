"use client";

import {
  CalendarDays,
  CircleDollarSign,
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
  selectDividendReconciliation,
  selectHistoricalDividendEvents,
  selectNextDividendEvent,
  selectReceivedDividendEvents,
  selectUpcomingDividendEvents,
} from "@/core/portfolio-engine/client/dividend-selectors";

import type {
  PortfolioDividendDataStatus,
  PortfolioDividendEvent,
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

function quantity(
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat(
    "en-AU",
    {
      maximumFractionDigits: 8,
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

function eventStatusLabel(
  event: PortfolioDividendEvent,
): string {
  if (event.isReceived) {
    return "Received";
  }

  if (event.isAnnounced) {
    return "Announced";
  }

  if (event.isForecast) {
    return "Forecast";
  }

  return event.status;
}

function eventStatusClass(
  event: PortfolioDividendEvent,
): string {
  if (event.isReceived) {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";
  }

  if (event.isAnnounced) {
    return "border-cyan-400/25 bg-cyan-400/10 text-cyan-200";
  }

  if (event.isForecast) {
    return "border-amber-400/25 bg-amber-400/10 text-amber-200";
  }

  return "border-white/10 bg-white/5 text-slate-300";
}

function statusPresentation(
  status: PortfolioDividendDataStatus,
): {
  title: string;
  className: string;
} {
  switch (status) {
    case "READY":
      return {
        title:
          "Dividend data is connected and reconciled.",
        className:
          "border-emerald-500/25 bg-emerald-500/5 text-emerald-200",
      };

    case "DEGRADED":
      return {
        title:
          "Dividend data is available with provider warnings.",
        className:
          "border-amber-500/25 bg-amber-500/5 text-amber-200",
      };

    case "ERROR":
      return {
        title:
          "Dividend providers could not return a usable result.",
        className:
          "border-rose-500/25 bg-rose-500/5 text-rose-200",
      };

    case "EMPTY":
      return {
        title:
          "No open holdings are available for dividend analysis.",
        className:
          "border-white/10 bg-white/[0.03] text-slate-300",
      };

    case "LOADING":
      return {
        title:
          "Loading dividend intelligence…",
        className:
          "border-cyan-500/25 bg-cyan-500/5 text-cyan-200",
      };

    case "IDLE":
      return {
        title:
          "Dividend intelligence is preparing.",
        className:
          "border-white/10 bg-white/[0.03] text-slate-300",
      };
  }
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

function EventTable({
  title,
  description,
  events,
  emptyMessage,
}: {
  title: string;
  description: string;
  events: PortfolioDividendEvent[];
  emptyMessage: string;
}) {
  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <div>
        <h2 className="text-lg font-semibold text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="px-3 py-2">
                Security
              </th>

              <th className="px-3 py-2">
                Status
              </th>

              <th className="px-3 py-2">
                Ex-date
              </th>

              <th className="px-3 py-2">
                Payment
              </th>

              <th className="px-3 py-2 text-right">
                Eligible Qty
              </th>

              <th className="px-3 py-2 text-right">
                Dividend / Share
              </th>

              <th className="px-3 py-2 text-right">
                Cash
              </th>

              <th className="px-3 py-2 text-right">
                Franking
              </th>

              <th className="px-3 py-2 text-right">
                Withholding
              </th>

              <th className="px-3 py-2">
                Provider
              </th>
            </tr>
          </thead>

          <tbody>
            {events.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-3 py-8 text-center text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              events.map(
                (event) => (
                  <tr
                    key={event.id}
                    className="border-t border-white/10 text-slate-200"
                  >
                    <td className="px-3 py-3">
                      <p className="font-semibold text-white">
                        {event.displaySymbol ||
                          event.symbol}
                      </p>

                      <p className="mt-0.5 text-[11px] text-slate-500">
                        {event.market} · {event.currency}
                      </p>
                    </td>

                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-medium ${eventStatusClass(
                          event,
                        )}`}
                      >
                        {eventStatusLabel(
                          event,
                        )}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      {dateLabel(
                        event.exDate,
                      )}
                    </td>

                    <td className="px-3 py-3">
                      {dateLabel(
                        event.paymentDate,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {quantity(
                        event.eligibleQuantity,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      {event.dividendPerShare === null
                        ? "—"
                        : Number(
                            event.dividendPerShare,
                          ).toLocaleString(
                            "en-AU",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 6,
                            },
                          )}
                    </td>

                    <td className="px-3 py-3 text-right font-medium text-white">
                      {money(
                        event.expectedCashAud,
                      )}
                    </td>

                    <td className="px-3 py-3 text-right">
                      <p>
                        {percent(
                          event.frankingPercentage,
                        )}
                      </p>

                      <p className="mt-0.5 text-[11px] text-emerald-300">
                        {money(
                          event.frankingCreditAud,
                        )}
                      </p>
                    </td>

                    <td className="px-3 py-3 text-right text-amber-300">
                      {money(
                        event.withholdingTaxAud,
                      )}
                    </td>

                    <td className="px-3 py-3">
                      {event.provider}
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

export default function DividendsPage() {
  const {
    dividendSnapshot,
    status,
    loading,
    refreshing,
    error,
    lastSuccessfulAt,
    forceRefresh,
  } = usePortfolioDividendEngine();

  const totals =
    dividendSnapshot.totals;

  const upcomingEvents =
    selectUpcomingDividendEvents(
      dividendSnapshot,
    );

  const receivedEvents =
    selectReceivedDividendEvents(
      dividendSnapshot,
    );

  const historicalEvents =
    selectHistoricalDividendEvents(
      dividendSnapshot,
    );

  const nextEvent =
    selectNextDividendEvent(
      dividendSnapshot,
    );

  const reconciliation =
    selectDividendReconciliation(
      dividendSnapshot,
    );

  const state =
    statusPresentation(
      loading
        ? "LOADING"
        : status,
    );

  const busy =
    loading ||
    refreshing;

  async function refreshDividendData() {
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
            Dividend Centre
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Historical, received and upcoming distributions derived from the
            same transactions, holdings and live valuation used throughout the
            Portfolio Engine.
          </p>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => {
            void refreshDividendData();
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
            : "Refresh dividends"}
        </button>
      </div>

      <section
        className={`rounded-2xl border px-5 py-4 ${state.className}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">
              {state.title}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Providers:{" "}
              {dividendSnapshot.providersUsed.length > 0
                ? dividendSnapshot.providersUsed.join(", ")
                : "none"}.
              {" "}Unresolved symbols:{" "}
              {dividendSnapshot.unresolvedSymbols.length}.
              {" "}Last successful refresh:{" "}
              {lastSuccessfulAt
                ? dateLabel(lastSuccessfulAt)
                : "—"}.
            </p>
          </div>

          <div className="text-right text-xs text-slate-400">
            <p>
              Snapshot: {dividendSnapshot.snapshotId}
            </p>

            <p className="mt-1">
              Reconciled:{" "}
              <span
                className={
                  reconciliation.valid
                    ? "text-emerald-300"
                    : "text-rose-300"
                }
              >
                {reconciliation.valid
                  ? "yes"
                  : "no"}
              </span>
            </p>
          </div>
        </div>

        {error ? (
          <p className="mt-3 text-xs leading-5 text-rose-300">
            {error}
          </p>
        ) : null}
      </section>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<CircleDollarSign />}
          label="Forward 12 Months"
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
          icon={<WalletCards />}
          label="Received FY"
          value={money(
            totals.receivedCurrentFinancialYearAud,
          )}
          detail={`${totals.receivedEventCount} received distribution${
            totals.receivedEventCount === 1
              ? ""
              : "s"
          }`}
        />

        <StatCard
          icon={<TrendingUp />}
          label="Portfolio Yield"
          value={percent(
            totals.portfolioDividendYieldPercent,
          )}
          detail={`Based on ${money(
            totals.securitiesMarketValueAud,
          )} canonical market value`}
        />

        <StatCard
          icon={<Landmark />}
          label="Yield on Cost"
          value={percent(
            totals.portfolioYieldOnCostPercent,
          )}
          detail={`Based on ${money(
            totals.openCostBaseAud,
          )} transaction cost base`}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard
          icon={<Coins />}
          label="Franking Credits"
          value={money(
            totals.projectedFrankingCreditsAud,
          )}
          detail="Projected forward franking credits"
        />

        <StatCard
          icon={<ShieldCheck />}
          label="Withholding Tax"
          value={money(
            totals.estimatedWithholdingTaxAud,
          )}
          detail="Estimated foreign withholding on forward events"
        />

        <StatCard
          icon={<CalendarDays />}
          label="Next Distribution"
          value={
            nextEvent
              ? money(
                  nextEvent.expectedCashAud,
                )
              : "—"
          }
          detail={
            nextEvent
              ? `${nextEvent.displaySymbol} · payment ${dateLabel(
                  nextEvent.paymentDate,
                )}`
              : "No upcoming eligible event"
          }
        />
      </div>

      <EventTable
        title="Upcoming Dividends"
        description="Announced and forecast events for shares held before each ex-dividend date."
        events={upcomingEvents}
        emptyMessage="No eligible upcoming distributions are currently available."
      />

      <EventTable
        title="Received Dividends"
        description="Received cash distributions derived from posted dividend transactions."
        events={receivedEvents}
        emptyMessage="No received dividend transactions are available."
      />

      <EventTable
        title="Dividend History"
        description="Historical provider and transaction-ledger distributions retained for reporting and tax analysis."
        events={historicalEvents}
        emptyMessage="No historical dividend events are available."
      />
    </div>
  );
}
