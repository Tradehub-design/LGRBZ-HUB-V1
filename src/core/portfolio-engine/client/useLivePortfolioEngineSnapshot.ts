"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
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
  loadRetainedPortfolioQuotes,
  mergeResilientPortfolioQuotes,
  saveRetainedPortfolioQuotes,
} from "./portfolio-quote-retention";

import {
  usePortfolioEngineSnapshot,
  type PortfolioEngineSnapshotState,
} from "./usePortfolioEngineSnapshot";

import type {
  QuoteSnapshot,
} from "../contracts";

export type LivePortfolioEngineSnapshotState =
  PortfolioEngineSnapshotState & {
    liveEngineResult:
      PortfolioEngineResult;

    liveQuoteCount:
      number;

    currentProviderQuoteCount:
      number;

    retainedQuoteCount:
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
        .map((symbol) =>
          symbol
            .trim()
            .toUpperCase(),
        )
        .filter(Boolean),
    ),
  );
}

function quoteIdentity(
  quotes:
    Readonly<
      Record<string, QuoteSnapshot>
    >,
): string {
  return Object.entries(quotes)
    .sort(
      ([left], [right]) =>
        left.localeCompare(right),
    )
    .map(
      ([securityId, quote]) =>
        [
          securityId,
          quote.price,
          quote.source,
          quote.quality,
          quote.provider,
          quote.quotedAt,
          quote.receivedAt,
        ].join("|"),
    )
    .join("::");
}

export function useLivePortfolioEngineSnapshot(
  options:
    UseLiveMarketQuotesOptions = {},
): LivePortfolioEngineSnapshotState {
  const base =
    usePortfolioEngineSnapshot();

  const baseSnapshot =
    base.engineResult.snapshot;

  const [
    persistedQuotes,
    setPersistedQuotes,
  ] = useState<
    Record<string, QuoteSnapshot>
  >({});

  const previousValidQuotesRef =
    useRef<
      Record<string, QuoteSnapshot>
    >({});

  useEffect(() => {
    const loaded =
      loadRetainedPortfolioQuotes();

    setPersistedQuotes(
      loaded,
    );

    previousValidQuotesRef.current =
      loaded;
  }, []);

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

  const openSecurityIds =
    useMemo(
      () =>
        baseSnapshot.openHoldings.map(
          (holding) =>
            holding.security.securityId,
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

  const currentProviderQuotes =
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

  const currentProviderQuoteIdentity =
    useMemo(
      () =>
        quoteIdentity(
          currentProviderQuotes,
        ),
      [
        currentProviderQuotes,
      ],
    );

  const persistedQuoteIdentity =
    useMemo(
      () =>
        quoteIdentity(
          persistedQuotes,
        ),
      [
        persistedQuotes,
      ],
    );

  const resilientQuotes =
    useMemo(
      () =>
        mergeResilientPortfolioQuotes({
          current:
            currentProviderQuotes,

          previous:
            previousValidQuotesRef.current,

          persisted:
            persistedQuotes,

          securityIds:
            openSecurityIds,
        }),
      [
        currentProviderQuoteIdentity,
        currentProviderQuotes,
        openSecurityIds,
        persistedQuoteIdentity,
        persistedQuotes,
      ],
    );

  const resilientQuoteIdentity =
    useMemo(
      () =>
        quoteIdentity(
          resilientQuotes,
        ),
      [
        resilientQuotes,
      ],
    );

  useEffect(() => {
    previousValidQuotesRef.current =
      resilientQuotes;

    saveRetainedPortfolioQuotes(
      resilientQuotes,
    );
  }, [
    resilientQuoteIdentity,
    resilientQuotes,
  ]);

  const liveEngineResult =
    useMemo(
      () =>
        buildPortfolioEngineFromCanonical({
          transactions:
            baseSnapshot.transactions,

          quotes:
            resilientQuotes,

          costBasisMethod:
            baseSnapshot.costBasisMethod,

          generatedAt:
            baseSnapshot.generatedAt,
        }),
      [
        baseSnapshot.costBasisMethod,
        baseSnapshot.generatedAt,
        baseSnapshot.transactions,
        resilientQuoteIdentity,
        resilientQuotes,
      ],
    );

  const currentProviderQuoteCount =
    quoteRecordCount(
      currentProviderQuotes,
    );

  const liveQuoteCount =
    quoteRecordCount(
      resilientQuotes,
    );

  const retainedQuoteCount =
    Math.max(
      0,
      liveQuoteCount -
      currentProviderQuoteCount,
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

    engineResult:
      liveEngineResult,

    liveEngineResult,

    liveQuoteCount,

    currentProviderQuoteCount,

    retainedQuoteCount,

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
