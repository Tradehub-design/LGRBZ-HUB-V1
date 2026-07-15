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

export type UseLiveMarketQuoteOptions =
  LiveQuoteSymbolOptions &
  LiveQuotePollingOptions;

function normaliseSymbol(
  value: string
): string {
  return value
    .trim()
    .toUpperCase();
}

function pollingInterval({
  entry,
  options,
  visible,
}: {
  entry:
    ReturnType<
      typeof useLiveQuoteStore.getState
    >["entries"][string] |
    undefined;

  options:
    UseLiveMarketQuoteOptions;

  visible:
    boolean;
}): number {
  if (
    !visible
  ) {
    return (
      options.backgroundIntervalMs ||
      300_000
    );
  }

  const marketOpen =
    entry?.quote?.marketState ===
      "OPEN" ||
    entry?.quote?.marketState ===
      "PRE_MARKET" ||
    entry?.quote?.marketState ===
      "AFTER_HOURS";

  if (
    marketOpen
  ) {
    return (
      options.marketOpenIntervalMs ||
      options.intervalMs ||
      60_000
    );
  }

  return (
    options.marketClosedIntervalMs ||
    options.intervalMs ||
    900_000
  );
}

export function useLiveMarketQuote(
  symbol: string,
  options:
    UseLiveMarketQuoteOptions = {}
) {
  const canonical =
    normaliseSymbol(
      symbol
    );

  const visible =
    usePageVisibility();

  const online =
    useNetworkStatus();

  const entry =
    useLiveQuoteStore(
      (
        state
      ) =>
        state.entries[
          canonical
        ]
  );

  const ensureEntry =
    useLiveQuoteStore(
      (
        state
      ) =>
        state.ensureEntry
    );

  const refreshQuote =
    useLiveQuoteStore(
      (
        state
      ) =>
        state.refreshQuote
    );

  const cancelQuote =
    useLiveQuoteStore(
      (
        state
      ) =>
        state.cancelQuote
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
          false
      ) => {
        if (
          !canonical
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

        return refreshQuote({
          symbol:
            canonical,

          options:
            symbolOptions,

          forceRefresh,

          reason:
            forceRefresh
              ? "FORCE"
              : "MANUAL",
        });
      },
      [
        canonical,
        options.minimumRefreshGapMs,
        refreshQuote,
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
      if (
        !canonical
      ) {
        return;
      }

      ensureEntry(
        canonical,
        symbolOptions
      );
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
        !canonical ||
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

      void refreshQuote({
        symbol:
          canonical,

        options:
          symbolOptions,

        reason:
          "INITIAL",
      });
    },
    [
      canonical,
      online,
      options.enabled,
      options.pauseWhenOffline,
      options.refreshOnMount,
      refreshQuote,
      symbolOptions,
    ]
  );

  useEffect(
    () => {
      if (
        !canonical ||
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

      const interval =
        pollingInterval({
          entry,

          options,

          visible,
        });

      const timer =
        window.setInterval(
          () => {
            void refreshQuote({
              symbol:
                canonical,

              options:
                symbolOptions,

              reason:
                "POLL",
            });
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
      canonical,
      entry,
      online,
      options,
      refreshQuote,
      symbolOptions,
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
        canonical &&
        online
      ) {
        void refreshQuote({
          symbol:
            canonical,

          options:
            symbolOptions,

          reason:
            "VISIBILITY",
        });
      }
    },
    [
      canonical,
      online,
      options.refreshWhenVisible,
      refreshQuote,
      symbolOptions,
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
          false &&
        canonical
      ) {
        void refreshQuote({
          symbol:
            canonical,

          options:
            symbolOptions,

          reason:
            "NETWORK_RESTORED",
        });
      }
    },
    [
      canonical,
      online,
      options.refreshWhenOnline,
      refreshQuote,
      symbolOptions,
    ]
  );

  useEffect(
    () => {
      return () => {
        if (
          canonical
        ) {
          cancelQuote(
            canonical
          );
        }
      };
    },
    [
      cancelQuote,
      canonical,
    ]
  );

  const status =
    useMemo(
      () =>
        describeLiveQuoteEntry(
          entry ||
          null
        ),
      [
        entry,
      ]
    );

  return {
    symbol:
      canonical,

    quote:
      entry?.quote ||
      null,

    entry:
      entry ||
      null,

    status,

    state:
      entry?.state ||
      "IDLE",

    loading:
      entry?.state ===
      "LOADING",

    refreshing:
      entry?.state ===
      "REFRESHING",

    error:
      entry?.errorMessage ||
      null,

    errorCode:
      entry?.errorCode ||
      null,

    online,
    visible,

    refresh,

    forceRefresh:
      () =>
        refresh(
          true
        ),

    cancel:
      () =>
        cancelQuote(
          canonical
        ),
  };
}
