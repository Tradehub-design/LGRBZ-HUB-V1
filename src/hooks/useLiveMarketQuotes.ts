"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  useLiveQuoteStore,
} from "@/lib/market-data/client/liveQuoteStore";
import {
  describeLiveQuoteEntry,
} from "@/lib/market-data/client/liveQuoteStatus";
import type {
  LiveQuotePollingOptions,
  LiveQuoteSymbolOptions,
} from "@/lib/market-data/client/liveQuoteClientTypes";
import {
  usePageVisibility,
} from "./usePageVisibility";
import {
  useNetworkStatus,
} from "./useNetworkStatus";

export type UseLiveMarketQuotesOptions =
  LiveQuoteSymbolOptions &
  LiveQuotePollingOptions & {
    concurrency?: number;
  };

function canonicalSymbols(
  symbols: string[]
): string[] {
  return Array.from(
    new Set(
      symbols
        .map(
          (
            symbol
          ) =>
            symbol
              .trim()
              .toUpperCase()
        )
        .filter(
          Boolean
        )
    )
  );
}

export function useLiveMarketQuotes(
  symbols: string[],
  options:
    UseLiveMarketQuotesOptions = {}
) {
  const symbolKey =
    canonicalSymbols(
      symbols
    ).join(
      "|"
    );

  const canonical =
    useMemo(
      () =>
        symbolKey
          ? symbolKey.split(
              "|"
            )
          : [],
      [
        symbolKey,
      ]
    );

  const visible =
    usePageVisibility();

  const online =
    useNetworkStatus();

  const entries =
    useLiveQuoteStore(
      (
        state
      ) =>
        canonical.map(
          (
            symbol
          ) =>
            state.entries[
              symbol
            ] ||
            null
        )
    );

  const ensureEntry =
    useLiveQuoteStore(
      (
        state
      ) =>
        state.ensureEntry
    );

  const refreshQuotes =
    useLiveQuoteStore(
      (
        state
      ) =>
        state.refreshQuotes
    );

  const cancelQuotes =
    useLiveQuoteStore(
      (
        state
      ) =>
        state.cancelQuotes
    );

  const setOnline =
    useLiveQuoteStore(
      (
        state
      ) =>
        state.setOnline
    );

  const setVisible =
    useLiveQuoteStore(
      (
        state
      ) =>
        state.setVisible
    );

  const lastRefreshRef =
    useRef(
      0
    );

  const symbolOptions =
    useMemo(
      () => ({
        exchange:
          options.exchange,

        currency:
          options.currency,

        providers:
          options.providers,

        allowDelayed:
          options.allowDelayed,

        allowIndicative:
          options.allowIndicative,

        allowStale:
          options.allowStale,

        allowExpiredFallback:
          options.allowExpiredFallback,

        compareProviders:
          options.compareProviders,

        minimumQualityScore:
          options.minimumQualityScore,

        maximumProviderAttempts:
          options.maximumProviderAttempts,

        timeoutMs:
          options.timeoutMs,
      }),
      [
        options.exchange,
        options.currency,
        options.providers,
        options.allowDelayed,
        options.allowIndicative,
        options.allowStale,
        options.allowExpiredFallback,
        options.compareProviders,
        options.minimumQualityScore,
        options.maximumProviderAttempts,
        options.timeoutMs,
      ]
    );

  const refresh =
    useCallback(
      async (
        forceRefresh =
          false,
        reason:
          "MANUAL" |
          "FORCE" |
          "POLL" |
          "INITIAL" |
          "VISIBILITY" |
          "NETWORK_RESTORED" =
            "MANUAL"
      ) => {
        if (
          canonical.length ===
          0
        ) {
          return null;
        }

        const now =
          Date.now();

        const minimumGap =
          options.minimumRefreshGapMs ||
          2_000;

        if (
          !forceRefresh &&
          now -
            lastRefreshRef.current <
            minimumGap
        ) {
          return null;
        }

        lastRefreshRef.current =
          now;

        return refreshQuotes({
          symbols:
            canonical,

          options:
            symbolOptions,

          forceRefresh,

          reason,

          concurrency:
            options.concurrency ||
            6,
        });
      },
      [
        canonical,
        options.concurrency,
        options.minimumRefreshGapMs,
        refreshQuotes,
        symbolOptions,
      ]
    );

  useEffect(
    () => {
      setOnline(
        online
      );
    },
    [
      online,
      setOnline,
    ]
  );

  useEffect(
    () => {
      setVisible(
        visible
      );
    },
    [
      visible,
      setVisible,
    ]
  );

  useEffect(
    () => {
      for (
        const symbol of
        canonical
      ) {
        ensureEntry(
          symbol,
          symbolOptions
        );
      }
    },
    [
      canonical,
      ensureEntry,
      symbolOptions,
    ]
  );

  useEffect(
    () => {
      if (
        canonical.length ===
          0 ||
        options.enabled ===
          false ||
        options.refreshOnMount ===
          false
      ) {
        return;
      }

      if (
        options.pauseWhenOffline !==
          false &&
        !online
      ) {
        return;
      }

      void refresh(
        false,
        "INITIAL"
      );
    },
    [
      canonical.length,
      online,
      options.enabled,
      options.pauseWhenOffline,
      options.refreshOnMount,
      refresh,
    ]
  );

  useEffect(
    () => {
      if (
        canonical.length ===
          0 ||
        options.enabled ===
          false
      ) {
        return;
      }

      if (
        options.pauseWhenHidden !==
          false &&
        !visible
      ) {
        return;
      }

      if (
        options.pauseWhenOffline !==
          false &&
        !online
      ) {
        return;
      }

      const anyOpen =
        entries.some(
          (
            entry
          ) =>
            entry?.quote?.marketState ===
              "OPEN" ||
            entry?.quote?.marketState ===
              "PRE_MARKET" ||
            entry?.quote?.marketState ===
              "AFTER_HOURS"
        );

      const interval =
        visible
          ? anyOpen
            ? options.marketOpenIntervalMs ||
              options.intervalMs ||
              60_000
            : options.marketClosedIntervalMs ||
              options.intervalMs ||
              900_000
          : options.backgroundIntervalMs ||
            300_000;

      const timer =
        window.setInterval(
          () => {
            void refresh(
              false,
              "POLL"
            );
          },
          Math.max(
            10_000,
            interval
          )
        );

      return () => {
        window.clearInterval(
          timer
        );
      };
    },
    [
      canonical.length,
      entries,
      online,
      options.backgroundIntervalMs,
      options.enabled,
      options.intervalMs,
      options.marketClosedIntervalMs,
      options.marketOpenIntervalMs,
      options.pauseWhenHidden,
      options.pauseWhenOffline,
      refresh,
      visible,
    ]
  );

  const previousVisibleRef =
    useRef(
      visible
    );

  useEffect(
    () => {
      const becameVisible =
        visible &&
        !previousVisibleRef.current;

      previousVisibleRef.current =
        visible;

      if (
        becameVisible &&
        options.refreshWhenVisible !==
          false &&
        online
      ) {
        void refresh(
          false,
          "VISIBILITY"
        );
      }
    },
    [
      online,
      options.refreshWhenVisible,
      refresh,
      visible,
    ]
  );

  const previousOnlineRef =
    useRef(
      online
    );

  useEffect(
    () => {
      const restored =
        online &&
        !previousOnlineRef.current;

      previousOnlineRef.current =
        online;

      if (
        restored &&
        options.refreshWhenOnline !==
          false
      ) {
        void refresh(
          false,
          "NETWORK_RESTORED"
        );
      }
    },
    [
      online,
      options.refreshWhenOnline,
      refresh,
    ]
  );

  useEffect(
    () => {
      return () => {
        cancelQuotes(
          canonical
        );
      };
    },
    [
      cancelQuotes,
      canonical,
    ]
  );

  const quotes =
    entries
      .map(
        (
          entry
        ) =>
          entry?.quote ||
          null
      )
      .filter(
        (
          quote
        ): quote is NonNullable<
          typeof quote
        > =>
          Boolean(
            quote
          )
      );

  const statusBySymbol =
    Object.fromEntries(
      canonical.map(
        (
          symbol,
          index
        ) => [
          symbol,
          describeLiveQuoteEntry(
            entries[
              index
            ] ||
            null
          ),
        ]
      )
    );

  const loading =
    entries.some(
      (
        entry
      ) =>
        entry?.state ===
        "LOADING"
    );

  const refreshing =
    entries.some(
      (
        entry
      ) =>
        entry?.state ===
        "REFRESHING"
    );

  const errors =
    entries
      .filter(
        (
          entry
        ) =>
          Boolean(
            entry?.errorMessage
          )
      )
      .map(
        (
          entry
        ) => ({
          symbol:
            entry?.symbol ||
            "",

          code:
            entry?.errorCode ||
            "UNKNOWN",

          message:
            entry?.errorMessage ||
            "Unknown quote error.",
        })
      );

  return {
    symbols:
      canonical,

    entries,

    quotes,

    quoteBySymbol:
      Object.fromEntries(
        canonical.map(
          (
            symbol,
            index
          ) => [
            symbol,
            entries[
              index
            ]?.quote ||
            null,
          ]
        )
      ),

    statusBySymbol,

    loading,
    refreshing,

    errorCount:
      errors.length,

    errors,

    online,
    visible,

    refresh:
      () =>
        refresh(
          false,
          "MANUAL"
        ),

    forceRefresh:
      () =>
        refresh(
          true,
          "FORCE"
        ),

    cancel:
      () =>
        cancelQuotes(
          canonical
        ),
  };
}
