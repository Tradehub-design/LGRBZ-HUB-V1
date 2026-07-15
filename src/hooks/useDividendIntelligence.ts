"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  DividendIntelligenceRequest,
  DividendIntelligenceResponse,
} from "@/lib/dividend-data";

type Options = {
  enabled?: boolean;
  refreshIntervalMs?: number;
};

type State = {
  data:
    DividendIntelligenceResponse | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
};

const EMPTY_STATE:
  State = {
    data:
      null,
    loading:
      false,
    refreshing:
      false,
    error:
      null,
  };

function requestItemCount(
  request:
    DividendIntelligenceRequest
): number {
  return (
    (
      request.holdings
        ?.length ||
      0
    ) +
    (
      request.securities
        ?.length ||
      0
    ) +
    (
      request.transactions
        ?.length ||
      0
    )
  );
}

export function useDividendIntelligence(
  request:
    DividendIntelligenceRequest,
  options:
    Options = {}
) {
  const {
    enabled = true,
    refreshIntervalMs =
      30 *
      60 *
      1000,
  } = options;

  const [
    state,
    setState,
  ] =
    useState<State>(
      EMPTY_STATE
    );

  const abortRef =
    useRef<
      AbortController | null
    >(null);

  const requestKey =
    useMemo(
      () =>
        JSON.stringify({
          holdings:
            request.holdings,
          securities:
            request.securities,
          transactions:
            request.transactions,
          startDate:
            request.startDate,
          endDate:
            request.endDate,
          baseCurrency:
            request.baseCurrency,
        }),
      [
        request.holdings,
        request.securities,
        request.transactions,
        request.startDate,
        request.endDate,
        request.baseCurrency,
      ]
    );

  const refresh =
    useCallback(
      async () => {
        const count =
          requestItemCount(
            request
          );

        if (
          !enabled ||
          count ===
            0
        ) {
          setState(
            EMPTY_STATE
          );

          return;
        }

        abortRef.current
          ?.abort();

        const controller =
          new AbortController();

        abortRef.current =
          controller;

        setState(
          (
            current
          ) => ({
            ...current,
            loading:
              !current.data,
            refreshing:
              Boolean(
                current.data
              ),
            error:
              null,
          })
        );

        try {
          const response =
            await fetch(
              "/api/dividend-data",
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
                  JSON.stringify(
                    request
                  ),
                cache:
                  "no-store",
                signal:
                  controller.signal,
              }
            );

          const payload =
            await response
              .json() as
              DividendIntelligenceResponse;

          if (
            !response.ok ||
            !payload.ok
          ) {
            throw new Error(
              payload.message ||
              `Dividend request failed with HTTP ${response.status}.`
            );
          }

          setState({
            data:
              payload,
            loading:
              false,
            refreshing:
              false,
            error:
              null,
          });
        } catch (
          error
        ) {
          if (
            error instanceof
              DOMException &&
            error.name ===
              "AbortError"
          ) {
            return;
          }

          setState(
            (
              current
            ) => ({
              ...current,
              loading:
                false,
              refreshing:
                false,
              error:
                error instanceof
                  Error
                  ? error.message
                  : "Dividend intelligence refresh failed.",
            })
          );
        }
      },
      [
        enabled,
        requestKey,
      ]
    );

  useEffect(
    () => {
      void refresh();

      return () =>
        abortRef.current
          ?.abort();
    },
    [
      refresh,
    ]
  );

  useEffect(
    () => {
      if (
        !enabled ||
        refreshIntervalMs <=
          0
      ) {
        return;
      }

      const timer =
        window.setInterval(
          () => {
            void refresh();
          },
          Math.max(
            5 *
              60 *
              1000,
            refreshIntervalMs
          )
        );

      return () =>
        window.clearInterval(
          timer
        );
    },
    [
      enabled,
      refreshIntervalMs,
      refresh,
    ]
  );

  return {
    ...state,

    events:
      state.data
        ?.events ||
      [],

    eligibility:
      state.data
        ?.eligibility ||
      [],

    summary:
      state.data
        ?.summary ||
      null,

    providersUsed:
      state.data
        ?.providersUsed ||
      [],

    unresolvedSymbols:
      state.data
        ?.unresolvedSymbols ||
      [],

    refresh,
  };
}
