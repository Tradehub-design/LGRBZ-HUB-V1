"use client";

import {
  HoldingsCommandCentre,
} from "@/components/holdings-professional/HoldingsCommandCentre";

import {
  ProfessionalHoldingsOverview,
} from "@/components/professional-overview/ProfessionalHoldingsOverview";

import {
  usePortfolioEngineSnapshot,
} from "@/core/portfolio-engine/client/usePortfolioEngineSnapshot";

import {
  selectApplicationClosedHoldings,
  selectApplicationOpenHoldings,
} from "@/core/portfolio-engine/client/selectors";

import type {
  PortfolioHolding,
} from "@/store/portfolioStore";

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
  holding: PortfolioHolding,
): string {
  const source =
    String(
      holding.quoteSource ??
      "",
    ).toUpperCase();

  switch (source) {
    case "LIVE":
      return "Live";

    case "CACHE":
      return "Cached";

    case "PREVIOUS_CLOSE":
      return "Previous close";

    case "TRANSACTION_FALLBACK":
      return "Latest transaction";

    case "UNAVAILABLE":
      return "Unavailable";

    default:
      return source || "Unknown";
  }
}

function quoteClass(
  holding: PortfolioHolding,
): string {
  const source =
    String(
      holding.quoteSource ??
      "",
    ).toUpperCase();

  switch (source) {
    case "LIVE":
      return "text-emerald-300";

    case "CACHE":
    case "PREVIOUS_CLOSE":
      return "text-cyan-300";

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

function DataQualityBanner({
  hydrated,
  source,
  errorCount,
  warningCount,
  fallbackQuoteCount,
  missingQuoteCount,
}: {
  hydrated: boolean;
  source: string;
  errorCount: number;
  warningCount: number;
  fallbackQuoteCount: number;
  missingQuoteCount: number;
}) {
  if (!hydrated) {
    return (
      <section className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-5 py-4">
        <p className="text-sm text-cyan-200">
          Loading the canonical Portfolio Engine…
        </p>
      </section>
    );
  }

  if (
    errorCount === 0 &&
    warningCount === 0
  ) {
    return (
      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
        <p className="text-sm font-medium text-emerald-200">
          Holdings are reconciled with the canonical Portfolio Engine.
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Transaction source: {source}.
        </p>
      </section>
    );
  }

  return (
    <section
      className={
        errorCount > 0
          ? "rounded-2xl border border-rose-500/30 bg-rose-500/5 px-5 py-4"
          : "rounded-2xl border border-amber-500/30 bg-amber-500/5 px-5 py-4"
      }
    >
      <p
        className={
          errorCount > 0
            ? "text-sm font-medium text-rose-200"
            : "text-sm font-medium text-amber-200"
        }
      >
        {errorCount > 0
          ? `${errorCount} Portfolio Engine error${errorCount === 1 ? "" : "s"} require attention.`
          : `${warningCount} Portfolio Engine warning${warningCount === 1 ? "" : "s"} detected.`}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        Source: {source}. Transaction-price fallbacks:{" "}
        {fallbackQuoteCount}. Missing prices: {missingQuoteCount}.
        Holdings values remain transaction-derived and are not replaced with
        mock figures.
      </p>
    </section>
  );
}

export default function HoldingsPage() {
  const {
    engineResult,
    source,
    hydrated,
  } = usePortfolioEngineSnapshot();

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

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
          Holdings
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white">
          Portfolio Holdings
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Calculated from the transaction ledger through the canonical
          Portfolio Engine.
        </p>
      </div>

      <DataQualityBanner
        hydrated={hydrated}
        source={source}
        errorCount={dataQuality.errorCount}
        warningCount={dataQuality.warningCount}
        fallbackQuoteCount={dataQuality.fallbackQuoteCount}
        missingQuoteCount={dataQuality.missingQuoteCount}
      />

      <div className="grid gap-3 md:grid-cols-4">
        <Stat
          label="Open Holdings"
          value={String(
            totals.openPositionCount,
          )}
          detail={`${totals.closedPositionCount} closed position${
            totals.closedPositionCount === 1
              ? ""
              : "s"
          }`}
        />

        <Stat
          label="Market Value"
          value={money(
            totals.securitiesMarketValueAud,
          )}
          detail="Open securities only"
        />

        <Stat
          label="Cost Base"
          value={money(
            totals.openCostBaseAud,
          )}
          detail="Remaining open-position cost base"
        />

        <Stat
          label="Total Return"
          value={`${money(
            totals.totalReturnAud,
          )} (${percent(
            totals.totalReturnPercent,
          )})`}
          detail="Realised + unrealised + received income"
        />
      </div>

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Open Positions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Quantities and cost bases are replayed from posted
              transactions. Valuations use the best available quote.
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
                  (holding) => (
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
                        {holding.marketPriceAud > 0
                          ? money(
                              holding.marketPriceAud,
                            )
                          : "Unavailable"}
                      </td>

                      <td className="px-3 py-2">
                        {holding.marketPriceAud > 0
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
                        {holding.marketPriceAud > 0 ? (
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
                        {holding.marketPriceAud > 0
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
                          holding,
                        )}`}
                      >
                        {quoteLabel(
                          holding,
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

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Closed Positions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Closed positions remain available for realised performance and
              tax reporting.
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
              {!hydrated ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-slate-400"
                  >
                    Loading closed positions…
                  </td>
                </tr>
              ) : closedHoldings.length === 0 ? (
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
                      <td className="px-3 py-2">
                        <p className="font-semibold">
                          {holding.ticker}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {holding.company}
                        </p>
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
