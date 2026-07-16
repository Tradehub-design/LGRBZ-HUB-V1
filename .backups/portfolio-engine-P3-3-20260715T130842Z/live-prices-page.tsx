"use client";

import {
  Activity,
  LineChart,
  Radio,
  RefreshCw,
  Wallet,
} from "lucide-react";

import {
  AssetLogo,
} from "@/components/workspace/asset-logo";

import {
  PremiumStatCard,
} from "@/components/workspace/premium-stat-card";

import {
  PremiumRow,
  PremiumTable,
  PremiumTableBody,
  PremiumTableHead,
  PremiumTd,
  PremiumTh,
} from "@/components/workspace/premium-table";

import {
  StatusPill,
} from "@/components/workspace/status-pill";

import {
  Workspace,
  WorkspaceGrid,
  WorkspaceHeader,
  WorkspaceLink,
  WorkspacePanel,
} from "@/components/workspace";

import {
  useLivePortfolioEngineSnapshot,
} from "@/core/portfolio-engine/client/useLivePortfolioEngineSnapshot";

import {
  selectPricingSourceSummary,
} from "@/core/portfolio-engine/client/live-market-selectors";

import {
  formatMoney,
  formatPercent,
} from "@/lib/portfolio-engine/format";

import type {
  PortfolioHolding,
  QuoteSource,
} from "@/core/portfolio-engine/contracts";

function statusTone(
  source: QuoteSource,
): "green" | "blue" | "amber" | "rose" | "purple" | "neutral" {
  switch (source) {
    case "LIVE":
      return "green";

    case "CACHE":
      return "blue";

    case "PREVIOUS_CLOSE":
      return "purple";

    case "TRANSACTION_FALLBACK":
      return "amber";

    case "UNAVAILABLE":
      return "rose";
  }
}

function sourceLabel(
  holding: PortfolioHolding,
): string {
  const provider =
    holding.valuation.quoteProvider;

  switch (
    holding.valuation.quoteSource
  ) {
    case "LIVE":
      return provider
        ? `Live · ${provider}`
        : "Live";

    case "CACHE":
      return provider.includes(
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
  }
}

function quoteTime(
  holding: PortfolioHolding,
): string {
  const value =
    holding.valuation.quotedAt;

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
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(timestamp));
}

function priceDisplay(
  holding: PortfolioHolding,
): string {
  if (
    holding.valuation.marketPriceAud <= 0 ||
    holding.valuation.quoteSource ===
      "UNAVAILABLE"
  ) {
    return "Unavailable";
  }

  return formatMoney(
    holding.valuation.marketPriceAud,
    2,
  );
}

function marketValueDisplay(
  holding: PortfolioHolding,
): string {
  if (
    holding.valuation.marketPriceAud <= 0 ||
    holding.valuation.quoteSource ===
      "UNAVAILABLE"
  ) {
    return "Awaiting price";
  }

  return formatMoney(
    holding.valuation.marketValueAud,
  );
}

export default function LivePricesPage() {
  const {
    engineResult,

    hydrated,
    liveLoading,
    liveRefreshing,
    liveOnline,
    liveErrorCount,

    currentProviderQuoteCount,
    retainedQuoteCount,
    liveQuoteCount,
    requestedQuoteCount,
    livePricingCoveragePercent,

    forceRefreshLiveQuotes,
  } = useLivePortfolioEngineSnapshot();

  const snapshot =
    engineResult.snapshot;

  const holdings =
    [...snapshot.openHoldings].sort(
      (left, right) =>
        right.valuation.marketValueAud -
        left.valuation.marketValueAud,
    );

  const pricingSummary =
    selectPricingSourceSummary(
      snapshot,
    );

  const refreshing =
    liveLoading ||
    liveRefreshing;

  const priceSourceSummary = [
    pricingSummary.live > 0
      ? `${pricingSummary.live} live`
      : "",

    pricingSummary.cached > 0
      ? `${pricingSummary.cached} cached`
      : "",

    pricingSummary.previousClose > 0
      ? `${pricingSummary.previousClose} previous close`
      : "",

    pricingSummary.transactionFallback > 0
      ? `${pricingSummary.transactionFallback} transaction fallback`
      : "",
  ]
    .filter(Boolean)
    .join(" · ");

  async function refreshPrices() {
    await forceRefreshLiveQuotes();
  }

  return (
    <Workspace>
      <WorkspaceHeader
        eyebrow="Market Engine"
        title="Live Prices"
        description="ASX and US holdings valued through the canonical Portfolio Engine using live, cached, previous-close and transaction fallback pricing."
        actions={
          <>
            <button
              type="button"
              onClick={() => {
                void refreshPrices();
              }}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50"
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

            <WorkspaceLink href="/watchlist">
              Watchlist
            </WorkspaceLink>

            <WorkspaceLink href="/holdings">
              Holdings
            </WorkspaceLink>
          </>
        }
      />

      <WorkspaceGrid columns="xl:grid-cols-4">
        <PremiumStatCard
          icon={<LineChart />}
          label="Tracked Holdings"
          value={String(
            snapshot.totals.openPositionCount,
          )}
          helper={`${requestedQuoteCount} market symbols requested`}
          tone="blue"
        />

        <PremiumStatCard
          icon={<Wallet />}
          label="Current Valuation"
          value={formatMoney(
            snapshot.totals.securitiesMarketValueAud,
          )}
          helper="Canonical live-valued holdings"
          tone="green"
        />

        <PremiumStatCard
          icon={<Activity />}
          label="Unrealised P/L"
          value={formatMoney(
            snapshot.totals.unrealisedGainAud,
          )}
          helper={`${formatPercent(
            snapshot.totals.openCostBaseAud > 0
              ? (
                  snapshot.totals.unrealisedGainAud /
                  snapshot.totals.openCostBaseAud
                ) * 100
              : 0,
          )} on open cost base`}
          tone={
            snapshot.totals.unrealisedGainAud >= 0
              ? "green"
              : "rose"
          }
        />

        <PremiumStatCard
          icon={<Radio />}
          label="Pricing Coverage"
          value={`${livePricingCoveragePercent.toFixed(
            1,
          )}%`}
          helper={
            priceSourceSummary ||
            "Awaiting quote resolution"
          }
          tone={
            livePricingCoveragePercent >= 99
              ? "purple"
              : livePricingCoveragePercent >= 75
                ? "amber"
                : "rose"
          }
        />
      </WorkspaceGrid>

      <WorkspacePanel title="Market Data Status">
        <div className="grid gap-3 md:grid-cols-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">
              Provider Quotes
            </p>

            <p className="mt-1 text-xl font-semibold text-white">
              {currentProviderQuoteCount}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">
              Retained Quotes
            </p>

            <p className="mt-1 text-xl font-semibold text-cyan-300">
              {retainedQuoteCount}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">
              Valid Prices
            </p>

            <p className="mt-1 text-xl font-semibold text-emerald-300">
              {liveQuoteCount}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">
              Provider Errors
            </p>

            <p
              className={
                liveErrorCount > 0
                  ? "mt-1 text-xl font-semibold text-amber-300"
                  : "mt-1 text-xl font-semibold text-emerald-300"
              }
            >
              {liveErrorCount}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-500">
              Network
            </p>

            <p
              className={
                liveOnline
                  ? "mt-1 text-xl font-semibold text-emerald-300"
                  : "mt-1 text-xl font-semibold text-rose-300"
              }
            >
              {liveOnline
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>
      </WorkspacePanel>

      <WorkspacePanel title="Price Coverage">
        <PremiumTable>
          <PremiumTableHead>
            <tr>
              <PremiumTh>
                Ticker
              </PremiumTh>

              <PremiumTh>
                Market
              </PremiumTh>

              <PremiumTh align="right">
                Quantity
              </PremiumTh>

              <PremiumTh align="right">
                Market Price
              </PremiumTh>

              <PremiumTh align="right">
                Market Value
              </PremiumTh>

              <PremiumTh align="right">
                Unrealised P/L
              </PremiumTh>

              <PremiumTh align="right">
                Weight
              </PremiumTh>

              <PremiumTh>
                Price Source
              </PremiumTh>

              <PremiumTh>
                Quote Time
              </PremiumTh>
            </tr>
          </PremiumTableHead>

          <PremiumTableBody>
            {!hydrated ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  Loading Portfolio Engine…
                </td>
              </tr>
            ) : holdings.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-10 text-center text-sm text-slate-400"
                >
                  No open holdings are available for market pricing.
                </td>
              </tr>
            ) : (
              holdings.map(
                (holding) => (
                  <PremiumRow
                    key={holding.holdingId}
                  >
                    <PremiumTd strong>
                      <div className="flex items-center gap-3">
                        <AssetLogo
                          symbol={
                            holding.security.ticker
                          }
                        />

                        <div>
                          <p>
                            {holding.security.ticker}
                          </p>

                          <p className="mt-0.5 text-[11px] font-normal text-slate-500">
                            {holding.security.name}
                          </p>
                        </div>
                      </div>
                    </PremiumTd>

                    <PremiumTd>
                      {holding.security.market}
                    </PremiumTd>

                    <PremiumTd align="right">
                      {holding.quantity.toLocaleString(
                        "en-AU",
                        {
                          maximumFractionDigits: 8,
                        },
                      )}
                    </PremiumTd>

                    <PremiumTd
                      align="right"
                      strong
                    >
                      {priceDisplay(
                        holding,
                      )}
                    </PremiumTd>

                    <PremiumTd
                      align="right"
                      strong
                    >
                      {marketValueDisplay(
                        holding,
                      )}
                    </PremiumTd>

                    <PremiumTd align="right">
                      <span
                        className={
                          holding.valuation
                            .unrealisedGainAud >= 0
                            ? "text-emerald-300"
                            : "text-rose-300"
                        }
                      >
                        {holding.valuation
                          .marketPriceAud > 0
                          ? formatMoney(
                              holding.valuation
                                .unrealisedGainAud,
                            )
                          : "—"}
                      </span>
                    </PremiumTd>

                    <PremiumTd align="right">
                      {holding.valuation
                        .marketPriceAud > 0
                        ? formatPercent(
                            holding.portfolioWeightPercent,
                          )
                        : "—"}
                    </PremiumTd>

                    <PremiumTd>
                      <StatusPill
                        tone={statusTone(
                          holding.valuation
                            .quoteSource,
                        )}
                      >
                        {sourceLabel(
                          holding,
                        )}
                      </StatusPill>
                    </PremiumTd>

                    <PremiumTd>
                      {quoteTime(
                        holding,
                      )}
                    </PremiumTd>
                  </PremiumRow>
                ),
              )
            )}
          </PremiumTableBody>
        </PremiumTable>
      </WorkspacePanel>
    </Workspace>
  );
}
