"use client";

import {
  useMemo,
} from "react";

import {
  useLiveMarketQuotes,
  type UseLiveMarketQuotesOptions,
} from "@/hooks/useLiveMarketQuotes";

import {
  buildPortfolioEngineFromCanonical,
  type PortfolioEngineResult,
} from "../engine";

import {
  createPortfolioQuoteRecord,
  quoteRecordCount,
} from "../adapters/live-market-quote-adapter";

import {
  usePortfolioEngineSnapshot,
  type PortfolioEngineSnapshotState,
} from "./usePortfolioEngineSnapshot";

export type LivePortfolioEngineSnapshotState =
  PortfolioEngineSnapshotState & {
    liveEngineResult:
      PortfolioEngineResult;

    liveQuoteCount:
      number;

    requestedQuoteCount:
      number;

    livePricingCoveragePercent:
      number;

    liveLoading:
      boolean;

    liveRefreshing:
      boolean;

    liveErrorCount:
      number;

    liveOnline:
      boolean;

    liveVisible:
      boolean;

    refreshLiveQuotes:
      () => Promise<unknown>;

    forceRefreshLiveQuotes:
      () => Promise<unknown>;
  };

function uniqueQuoteSymbols(
  symbols: readonly string[],
): string[] {
  return Array.from(
    new Set(
      symbols
        .map(
          (symbol) =>
            symbol
              .trim()
              .toUpperCase(),
        )
        .filter(Boolean),
    ),
  );
}

export function useLivePortfolioEngineSnapshot(
  options:
    UseLiveMarketQuotesOptions = {},
): LivePortfolioEngineSnapshotState {
  const base =
    usePortfolioEngineSnapshot();

  const baseSnapshot =
    base.engineResult.snapshot;

  const quoteSymbols =
    useMemo(
      () =>
        uniqueQuoteSymbols(
          baseSnapshot.openHoldings.map(
            (holding) =>
              holding.security.quoteTicker ||
              holding.security.ticker,
          ),
        ),
      [
        baseSnapshot.openHoldings,
      ],
    );

  const live =
    useLiveMarketQuotes(
      quoteSymbols,
      {
        enabled:
          options.enabled ??
          true,

        refreshOnMount:
          options.refreshOnMount ??
          true,

        allowDelayed:
          options.allowDelayed ??
          true,

        allowStale:
          options.allowStale ??
          true,

        allowExpiredFallback:
          options.allowExpiredFallback ??
          true,

        allowIndicative:
          options.allowIndicative ??
          false,

        minimumQualityScore:
          options.minimumQualityScore ??
          45,

        maximumProviderAttempts:
          options.maximumProviderAttempts ??
          3,

        marketOpenIntervalMs:
          options.marketOpenIntervalMs ??
          60_000,

        marketClosedIntervalMs:
          options.marketClosedIntervalMs ??
          900_000,

        backgroundIntervalMs:
          options.backgroundIntervalMs ??
          300_000,

        pauseWhenHidden:
          options.pauseWhenHidden ??
          true,

        pauseWhenOffline:
          options.pauseWhenOffline ??
          true,

        refreshWhenVisible:
          options.refreshWhenVisible ??
          true,

        refreshWhenOnline:
          options.refreshWhenOnline ??
          true,

        minimumRefreshGapMs:
          options.minimumRefreshGapMs ??
          2_000,

        timeoutMs:
          options.timeoutMs ??
          8_000,

        concurrency:
          options.concurrency ??
          6,

        providers:
          options.providers,

        compareProviders:
          options.compareProviders,

        exchange:
          options.exchange,

        currency:
          options.currency,

        intervalMs:
          options.intervalMs,
      },
    );

  const portfolioQuotes =
    useMemo(
      () =>
        createPortfolioQuoteRecord(
          baseSnapshot.openHoldings,
          live.quoteBySymbol,
        ),
      [
        baseSnapshot.openHoldings,
        live.quoteBySymbol,
      ],
    );

  const liveEngineResult =
    useMemo(
      () =>
        buildPortfolioEngineFromCanonical({
          transactions:
            baseSnapshot.transactions,

          quotes:
            portfolioQuotes,

          costBasisMethod:
            baseSnapshot.costBasisMethod,

          generatedAt:
            baseSnapshot.generatedAt,
        }),
      [
        baseSnapshot.costBasisMethod,
        baseSnapshot.generatedAt,
        baseSnapshot.transactions,
        portfolioQuotes,
      ],
    );

  const liveQuoteCount =
    quoteRecordCount(
      portfolioQuotes,
    );

  const requestedQuoteCount =
    quoteSymbols.length;

  const livePricingCoveragePercent =
    requestedQuoteCount > 0
      ? (
          liveQuoteCount /
          requestedQuoteCount
        ) * 100
      : 100;

  return {
    ...base,

    /**
     * Keep engineResult available for compatibility, but point it at the
     * live-valued result so consumers cannot accidentally read the stale base
     * snapshot.
     */
    engineResult:
      liveEngineResult,

    liveEngineResult,

    liveQuoteCount,

    requestedQuoteCount,

    livePricingCoveragePercent,

    liveLoading:
      live.loading,

    liveRefreshing:
      live.refreshing,

    liveErrorCount:
      live.errorCount,

    liveOnline:
      live.online,

    liveVisible:
      live.visible,

    refreshLiveQuotes:
      live.refresh,

    forceRefreshLiveQuotes:
      live.forceRefresh,
  };
}
