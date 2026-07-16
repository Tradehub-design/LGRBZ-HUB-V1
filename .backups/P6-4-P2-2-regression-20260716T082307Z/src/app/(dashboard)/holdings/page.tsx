"use client";

import {
  RefreshCw,
} from "lucide-react";

import {
  HoldingsCommandCentre,
} from "@/components/holdings-professional/HoldingsCommandCentre";

import {
  ProfessionalHoldingsOverview,
} from "@/components/professional-overview/ProfessionalHoldingsOverview";

import {
  useLivePortfolioEngineSnapshot,
} from "@/core/portfolio-engine/client/useLivePortfolioEngineSnapshot";

import {
  selectPricingSourceSummary,
} from "@/core/portfolio-engine/client/live-market-selectors";

import {
  selectApplicationClosedHoldings,
  selectApplicationOpenHoldings,
} from "@/core/portfolio-engine/client/selectors";

function money(
  value: number,
): string {
  if (!Number.isFinite(value)) {
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
  value: number,
): string {
  if (!Number.isFinite(value)) {
    return "—";
  }

  return `${value.toFixed(2)}%`;
}

function gainClass(
  value: number,
): string {
  if (!Number.isFinite(value) || value === 0) {
    return "px-3 py-2 text-slate-200";
  }

  return value > 0
    ? "px-3 py-2 text-emerald-300"
    : "px-3 py-2 text-rose-300";
}

function quoteLabel(
  source: unknown,
  provider: unknown,
): string {
  const canonical =
    String(source ?? "")
      .trim()
      .toUpperCase();

  const providerName =
    String(provider ?? "")
      .trim();

  switch (canonical) {
    case "LIVE":
      return providerName
        ? `Live · ${providerName}`
        : "Live";

    case "CACHE":
      return providerName.includes(
        "LAST_KNOWN_VALID",
      )
        ? "Last-known valid"
        : "Cached";

    case "PREVIOUS_CLOSE":
      return "Previous close";

    case "TRANSACTION_FALLBACK":
      return "Latest transaction";

    case "UNAVAILABLE":
      return "Unavailable";

    default:
      return canonical || "Unknown";
  }
}

function quoteClass(
  source: unknown,
): string {
  switch (
    String(source ?? "")
      .trim()
      .toUpperCase()
  ) {
    case "LIVE":
      return "text-emerald-300";

    case "CACHE":
      return "text-cyan-300";

    case "PREVIOUS_CLOSE":
      return "text-blue-300";

    case "TRANSACTION_FALLBACK":
      return "text-amber-300";

    case "UNAVAILABLE":
      return "text-rose-300";

    default:
      return "text-slate-400";
  }
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-white">
        {value}
      </p>

      {detail ? (
        <p className="mt-2 text-xs text-slate-500">
          {detail}
        </p>
      ) : null}
    </div>
  );
}

export default function HoldingsPage() {
  const {
    engineResult,
    source,
    hydrated,

    liveLoading,
    liveRefreshing,
    liveErrorCount,
    liveOnline,

    liveQuoteCount,
    retainedQuoteCount,
    requestedQuoteCount,
    livePricingCoveragePercent,

    forceRefreshLiveQuotes,
  } = useLivePortfolioEngineSnapshot();

  const snapshot =
    engineResult.snapshot;

  const openHoldings =
    selectApplicationOpenHoldings(
      snapshot,
    );

  const closedHoldings =
    selectApplicationClosedHoldings(
      snapshot,
    );

  const totals =
    snapshot.totals;

  const dataQuality =
    snapshot.dataQuality;

  const pricingSummary =
    selectPricingSourceSummary(
      snapshot,
    );

  const refreshing =
    liveLoading ||
    liveRefreshing;

  async function refreshPrices() {
    await forceRefreshLiveQuotes();
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            Holdings
          </p>

          <h1 className="mt-2 text-3xl font-bold text-white">
            Portfolio Holdings
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Transactions, holdings and market valuation are reconciled through
            the canonical Portfolio Engine.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void refreshPrices();
          }}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={
              refreshing
                ? "h-4 w-4 animate-spin"
                : "h-4 w-4"
            }
          />

          {refreshing
            ? "Refreshing…"
            : "Refresh prices"}
        </button>
      </div>

      <section
        className={
          dataQuality.errorCount > 0
            ? "rounded-2xl border border-rose-500/30 bg-rose-500/5 px-5 py-4"
            : dataQuality.warningCount > 0 ||
                retainedQuoteCount > 0 ||
                liveErrorCount > 0
              ? "rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4"
              : "rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4"
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-white">
              {!hydrated
                ? "Loading Portfolio Engine…"
                : dataQuality.errorCount > 0
                  ? `${dataQuality.errorCount} data error${
                      dataQuality.errorCount === 1
                        ? ""
                        : "s"
                    } require attention.`
                  : retainedQuoteCount > 0
                    ? `${retainedQuoteCount} last-known valid quote${
                        retainedQuoteCount === 1
                          ? " is"
                          : "s are"
                      } protecting valuation during provider degradation.`
                    : "Portfolio holdings and valuation are reconciled."}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              Transaction source: {source}. Online:{" "}
              {liveOnline ? "yes" : "no"}. Quote coverage:{" "}
              {liveQuoteCount}/{requestedQuoteCount} (
              {livePricingCoveragePercent.toFixed(1)}%).
            </p>
          </div>

          <div className="text-right text-xs text-slate-400">
            <p>
              Live: {pricingSummary.live}
            </p>

            <p>
              Cached: {pricingSummary.cached}
            </p>

            <p>
              Previous close:{" "}
              {pricingSummary.previousClose}
            </p>

            <p>
              Transaction fallback:{" "}
              {pricingSummary.transactionFallback}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat
          label="Open Holdings"
          value={String(
            totals.openPositionCount,
          )}
          detail={`${totals.closedPositionCount} closed`}
        />

        <Stat
          label="Market Value"
          value={money(
            totals.securitiesMarketValueAud,
          )}
          detail="Live-valued open securities"
        />

        <Stat
          label="Cost Base"
          value={money(
            totals.openCostBaseAud,
          )}
          detail="Transaction-derived"
        />

        <Stat
          label="Total Return"
          value={`${money(
            totals.totalReturnAud,
          )} (${percent(
            totals.totalReturnPercent,
          )})`}
          detail="Realised + unrealised + income"
        />
      </div>

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Open Positions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Quantities and cost bases come only from posted transactions.
              Prices use the strongest available market-data source.
            </p>
          </div>

          <div className="text-right text-xs text-slate-500">
            <p>
              Unrealised P/L:{" "}
              <span
                className={
                  totals.unrealisedGainAud >= 0
                    ? "text-emerald-300"
                    : "text-rose-300"
                }
              >
                {money(
                  totals.unrealisedGainAud,
                )}
              </span>
            </p>

            <p className="mt-1">
              Realised P/L:{" "}
              <span
                className={
                  totals.realisedGainAud >= 0
                    ? "text-emerald-300"
                    : "text-rose-300"
                }
              >
                {money(
                  totals.realisedGainAud,
                )}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="px-3 py-2">
                  Ticker
                </th>

                <th className="px-3 py-2">
                  Qty
                </th>

                <th className="px-3 py-2">
                  Avg Cost
                </th>

                <th className="px-3 py-2">
                  Market Price
                </th>

                <th className="px-3 py-2">
                  Market Value
                </th>

                <th className="px-3 py-2">
                  Cost Base
                </th>

                <th className="px-3 py-2">
                  Unrealised P/L
                </th>

                <th className="px-3 py-2">
                  Weight
                </th>

                <th className="px-3 py-2">
                  Sector
                </th>

                <th className="px-3 py-2">
                  Price Source
                </th>
              </tr>
            </thead>

            <tbody>
              {!hydrated ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-3 py-8 text-center text-slate-400"
                  >
                    Loading holdings…
                  </td>
                </tr>
              ) : openHoldings.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-3 py-8 text-center text-slate-400"
                  >
                    No open holdings were produced from the posted
                    transaction ledger.
                  </td>
                </tr>
              ) : (
                openHoldings.map(
                  (holding) => {
                    const priced =
                      holding.marketPriceAud > 0 &&
                      String(
                        holding.quoteSource,
                      ).toUpperCase() !==
                        "UNAVAILABLE";

                    return (
                      <tr
                        key={holding.id}
                        className="border-t border-white/10 text-white"
                      >
                        <td className="px-3 py-2">
                          <p className="font-semibold">
                            {holding.ticker}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {holding.company}
                          </p>
                        </td>

                        <td className="px-3 py-2">
                          {quantity(
                            holding.quantity,
                          )}
                        </td>

                        <td className="px-3 py-2">
                          {money(
                            holding.averageCostAud,
                          )}
                        </td>

                        <td className="px-3 py-2">
                          {priced
                            ? money(
                                holding.marketPriceAud,
                              )
                            : "Unavailable"}
                        </td>

                        <td className="px-3 py-2">
                          {priced
                            ? money(
                                holding.marketValueAud,
                              )
                            : "Awaiting price"}
                        </td>

                        <td className="px-3 py-2">
                          {money(
                            holding.costBaseAud,
                          )}
                        </td>

                        <td
                          className={gainClass(
                            holding.unrealisedPlAud,
                          )}
                        >
                          {priced ? (
                            <>
                              {money(
                                holding.unrealisedPlAud,
                              )}{" "}
                              (
                              {percent(
                                holding.unrealisedPlPercent,
                              )}
                              )
                            </>
                          ) : (
                            "Awaiting price"
                          )}
                        </td>

                        <td className="px-3 py-2">
                          {priced
                            ? percent(
                                holding.portfolioWeightPercent,
                              )
                            : "—"}
                        </td>

                        <td className="px-3 py-2">
                          {holding.sector ||
                            "Unclassified"}
                        </td>

                        <td
                          className={`px-3 py-2 ${quoteClass(
                            holding.quoteSource,
                          )}`}
                        >
                          {quoteLabel(
                            holding.quoteSource,
                            holding.quoteProvider,
                          )}
                        </td>
                      </tr>
                    );
                  },
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Closed Positions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Retained for realised performance, tax and reporting.
            </p>
          </div>

          <p
            className={
              totals.realisedGainAud >= 0
                ? "text-sm font-medium text-emerald-300"
                : "text-sm font-medium text-rose-300"
            }
          >
            Total realised:{" "}
            {money(
              totals.realisedGainAud,
            )}
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="px-3 py-2">
                  Ticker
                </th>

                <th className="px-3 py-2">
                  Realised P/L
                </th>

                <th className="px-3 py-2">
                  Disposed Cost Base
                </th>

                <th className="px-3 py-2">
                  Sale Proceeds
                </th>

                <th className="px-3 py-2">
                  Sector
                </th>

                <th className="px-3 py-2">
                  Platform
                </th>
              </tr>
            </thead>

            <tbody>
              {closedHoldings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-slate-400"
                  >
                    No closed positions yet.
                  </td>
                </tr>
              ) : (
                closedHoldings.map(
                  (holding) => (
                    <tr
                      key={holding.id}
                      className="border-t border-white/10 text-white"
                    >
                      <td className="px-3 py-2 font-semibold">
                        {holding.ticker}
                      </td>

                      <td
                        className={gainClass(
                          holding.realisedPlAud,
                        )}
                      >
                        {money(
                          holding.realisedPlAud,
                        )}
                      </td>

                      <td className="px-3 py-2">
                        {money(
                          Number(
                            holding.disposedCostBaseAud ??
                              0,
                          ),
                        )}
                      </td>

                      <td className="px-3 py-2">
                        {money(
                          Number(
                            holding.realisedProceedsAud ??
                              0,
                          ),
                        )}
                      </td>

                      <td className="px-3 py-2">
                        {holding.sector ||
                          "Unclassified"}
                      </td>

                      <td className="px-3 py-2">
                        {holding.platform ||
                          "Unassigned"}
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {openHoldings.length > 0 ? (
        <>
          <HoldingsCommandCentre
            holdings={openHoldings}
          />

          <ProfessionalHoldingsOverview
            holdings={openHoldings}
          />
        </>
      ) : null}
    </div>
  );
}
