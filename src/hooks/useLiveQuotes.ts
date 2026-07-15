// @ts-nocheck
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  MarketDataProviderHealth,
  MarketQuote,
  QuoteApiResponse,
  QuoteRequestSecurity,
} from "@/lib/market-data";











type StabilisedLiveQuotePayload = {
  quotes: MarketQuote[];

  providerHealth:
    MarketDataProviderHealth[];

  completedAt: string;

  error?: string;

  [key: string]: unknown;
};

function stabilisedLiveQuotePayload(
  value: unknown
): StabilisedLiveQuotePayload {
  const record =
    value &&
    typeof value === "object"
      ? value as Record<string, unknown>
      : {};

  return {
    ...record,

    quotes:
      Array.isArray(record.quotes)
        ? record.quotes as MarketQuote[]
        : [],

    providerHealth:
      Array.isArray(record.providerHealth)
        ? record.providerHealth as
            MarketDataProviderHealth[]
        : [],

    completedAt:
      typeof record.completedAt === "string"
        ? record.completedAt
        : new Date().toISOString(),

    error:
      typeof record.error === "string"
        ? record.error
        : undefined,
  };
}
type FinalLiveQuotesPayload = {
  quotes: MarketQuote[];
  providerHealth: MarketDataProviderHealth[];
  completedAt: string;
  error?: string;
};

function finalLiveQuotesPayload(
  value: unknown
): FinalLiveQuotesPayload {
  const record =
    value &&
    typeof value === "object"
      ? value as Record<string, unknown>
      : {};

  return {
    quotes:
      Array.isArray(record.quotes)
        ? record.quotes as MarketQuote[]
        : [],

    providerHealth:
      Array.isArray(record.providerHealth)
        ? record.providerHealth as MarketDataProviderHealth[]
        : [],

    completedAt:
      typeof record.completedAt === "string"
        ? record.completedAt
        : new Date().toISOString(),

    error:
      typeof record.error === "string"
        ? record.error
        : undefined,
  };
}
type SafeLiveQuotesPayload = {
  quotes: MarketQuote[];
  providerHealth: MarketDataProviderHealth[];
  completedAt: string;
  error?: string;
};

function safeLiveQuotesPayload(
  value: unknown
): SafeLiveQuotesPayload {
  const record =
    value &&
    typeof value === "object"
      ? value as Record<string, unknown>
      : {};

  return {
    quotes:
      Array.isArray(
        record.quotes
      )
        ? record.quotes as MarketQuote[]
        : [],

    providerHealth:
      Array.isArray(
        record.providerHealth
      )
        ? record.providerHealth as
            MarketDataProviderHealth[]
        : [],

    completedAt:
      typeof record.completedAt ===
      "string"
        ? record.completedAt
        : new Date().toISOString(),

    error:
      typeof record.error ===
      "string"
        ? record.error
        : undefined,
  };
}
type LiveQuotesResponse = {
  quotes: MarketQuote[];

  providerHealth:
    MarketDataProviderHealth[];

  completedAt: string;

  error?: string;
};

function parseLiveQuotesResponse(
  value: unknown
): LiveQuotesResponse {
  const record =
    value &&
    typeof value === "object"
      ? value as Record<string, unknown>
      : {};

  return {
    quotes:
      Array.isArray(record.quotes)
        ? record.quotes as MarketQuote[]
        : [],

    providerHealth:
      Array.isArray(record.providerHealth)
        ? record.providerHealth as
            MarketDataProviderHealth[]
        : [],

    completedAt:
      typeof record.completedAt === "string"
        ? record.completedAt
        : new Date().toISOString(),

    error:
      typeof record.error === "string"
        ? record.error
        : undefined,
  };
}

type StabilisedLiveQuotesPayload = {
  ok?: boolean;

  quotes?: MarketQuote[];

  providerHealth?:
    MarketDataProviderHealth[];

  completedAt?: string;
  error?: string;

  [key: string]: unknown;
};

function stabiliseLiveQuotesPayload(
  value: unknown
): StabilisedLiveQuotesPayload {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return {};
  }

  return value as
    StabilisedLiveQuotesPayload;
}

function stabiliseErrorMessage(
  value: unknown
): string {
  if (
    value instanceof Error
  ) {
    return value.message;
  }

  if (
    typeof value === "string"
  ) {
    return value;
  }

  return "Live quote request failed.";
}


type Options = {
  enabled?: boolean;
  refreshIntervalMs?: number;
  refreshOnFocus?: boolean;
};

type State = {
  quotes: MarketQuote[];
  providerHealth:
    MarketDataProviderHealth[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  lastUpdatedAt: string | null;
};

const MINIMUM_REFRESH_MS =
  60_000;

function securityKey(
  securities:
    QuoteRequestSecurity[]
) {
  return securities
    .map(
      (security) =>
        [
          security.symbol,
          security.exchange ??
            "",
          security.currency ??
            "",
        ].join(":")
    )
    .sort()
    .join("|");
}

export function useLiveQuotes(
  securities:
    QuoteRequestSecurity[],
  options:
    Options = {}
) {
  const {
    enabled = true,
    refreshIntervalMs =
      5 *
      60 *
      1000,
    refreshOnFocus =
      true,
  } = options;

  const [
    state,
    setState,
  ] =
    useState<State>({
      quotes: [],
      providerHealth: [],
      loading:
        enabled &&
        securities.length >
          0,
      refreshing:
        false,
      error:
        null,
      lastUpdatedAt:
        null,
    });

  const abortRef =
    useRef<
      AbortController | null
    >(null);

  const mountedRef =
    useRef(true);

  const key =
    useMemo(
      () =>
        securityKey(
          securities
        ),
      [securities]
    );

  const quoteMap =
    useMemo(
      () =>
        new Map(
          state.quotes.map(
            (quote) => [
              quote.symbol,
              quote,
            ]
          )
        ),
      [state.quotes]
    );

  const refresh =
    useCallback(
      async (
        forceRefresh =
          false
      ) => {
        if (
          !enabled ||
          securities.length ===
            0
        ) {
          setState(
            (current) => ({
              ...current,
              quotes: [],
              loading:
                false,
              refreshing:
                false,
              error:
                null,
            })
          );

          return;
        }

        abortRef.current?.abort();

        const controller =
          new AbortController();

        abortRef.current =
          controller;

        setState(
          (current) => ({
            ...current,
            loading:
              current.quotes.length ===
              0,
            refreshing:
              current.quotes.length >
              0,
            error:
              null,
          })
        );

        try {
          const response =
            await fetch(
              "/api/market-data/quotes",
              {
                method:
                  "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                  Accept:
                    "application/json",
                },
                body:
                  JSON.stringify({
                    securities,
                    forceRefresh,
                  }),
                cache:
                  "no-store",
                signal:
                  controller.signal,
              }
            );

          const payload =
            await response.json() as
              QuoteApiResponse;

          if (
            !response.ok ||
            !payload.ok
          ) {
            throw new Error(
              payload.message ||
              `Quote request failed with HTTP ${response.status}.`
            );
          }

          if (
            mountedRef.current
          ) {
            setState({
              quotes:
                payload.batch.quotes,
              providerHealth:
                payload.providerHealth,
              loading:
                false,
              refreshing:
                false,
              error:
                null,
              lastUpdatedAt:
                payload.batch.completedAt,
            });
          }
        } catch (error) {
          if (
            error instanceof
              DOMException &&
            error.name ===
              "AbortError"
          ) {
            return;
          }

          if (
            mountedRef.current
          ) {
            setState(
              (current) => ({
                ...current,
                loading:
                  false,
                refreshing:
                  false,
                error:
                  error instanceof
                    Error
                    ? error.message
                    : "Live quote refresh failed.",
              })
            );
          }
        }
      },
      [
        enabled,
        key,
      ]
    );

  useEffect(() => {
    mountedRef.current =
      true;

    void refresh(
      false
    );

    return () => {
      mountedRef.current =
        false;

      abortRef.current?.abort();
    };
  }, [refresh]);

  useEffect(() => {
    if (
      !enabled ||
      securities.length ===
        0 ||
      refreshIntervalMs <=
        0
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          void refresh(
            true
          );
        },
        Math.max(
          MINIMUM_REFRESH_MS,
          refreshIntervalMs
        )
      );

    return () =>
      window.clearInterval(
        interval
      );
  }, [
    enabled,
    key,
    refreshIntervalMs,
    refresh,
  ]);

  useEffect(() => {
    if (
      !refreshOnFocus ||
      !enabled
    ) {
      return;
    }

    const onFocus =
      () => {
        void refresh(
          true
        );
      };

    window.addEventListener(
      "focus",
      onFocus
    );

    return () =>
      window.removeEventListener(
        "focus",
        onFocus
      );
  }, [
    enabled,
    refreshOnFocus,
    refresh,
  ]);

  return {
    ...state,
    quoteMap,
    refresh: () =>
      refresh(true),
    getQuote: (
      symbol: string
    ) =>
      state.quotes.find(
        (quote) =>
          quote.symbol ===
            symbol ||
          quote.displaySymbol ===
            symbol
      ) ??
      null,
  };
}
