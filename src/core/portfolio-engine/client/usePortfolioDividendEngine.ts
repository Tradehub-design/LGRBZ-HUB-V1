"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  createPortfolioDividendApiPayload,
  dividendPayloadIdentity,
} from "../adapters/dividend-intelligence-adapter";

import {
  buildPortfolioDividendSnapshot,
} from "../dividends/snapshot";

import type {
  PortfolioDividendApiResult,
  PortfolioDividendDataStatus,
  PortfolioDividendEngineState,
  PortfolioDividendSnapshot,
} from "../dividends/contracts";

import {
  loadRetainedDividendResponse,
  saveRetainedDividendResponse,
} from "./portfolio-dividend-retention";

import {
  useLivePortfolioEngineSnapshot,
} from "./useLivePortfolioEngineSnapshot";

const EMPTY_PROVIDER_SUMMARY = {
  currency:
    "AUD",

  trailingTwelveMonthIncome:
    0,

  forwardTwelveMonthIncome:
    0,

  announcedForwardIncome:
    0,

  forecastForwardIncome:
    0,

  receivedCurrentFinancialYear:
    0,

  projectedFrankingCredits:
    0,

  portfolioDividendYield:
    null,

  portfolioYieldOnCost:
    null,

  nextEvent:
    null,

  monthlyForecast:
    [],

  holdingSummaries:
    [],

  eventCount:
    0,

  announcedEventCount:
    0,

  forecastEventCount:
    0,

  receivedEventCount:
    0,

  generatedAt:
    new Date(0).toISOString(),
} satisfies
  PortfolioDividendApiResult["summary"];

function emptyApiResult():
  PortfolioDividendApiResult {
  return {
    ok: true,

    events: [],

    eligibility: [],

    summary: {
      ...EMPTY_PROVIDER_SUMMARY,
    },

    providersUsed:
      [],

    unresolvedSymbols:
      [],
  };
}

async function requestDividendIntelligence(input: {
  payload:
    ReturnType<
      typeof createPortfolioDividendApiPayload
    >;

  signal:
    AbortSignal;
}): Promise<PortfolioDividendApiResult> {
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

        cache:
          "no-store",

        signal:
          input.signal,

        body:
          JSON.stringify(
            input.payload,
          ),
      },
    );

  const body =
    await response.json() as
      PortfolioDividendApiResult;

  if (
    !response.ok ||
    body.ok !== true
  ) {
    throw new Error(
      body.message ||
      `Dividend data request failed with status ${response.status}.`,
    );
  }

  return body;
}

export function usePortfolioDividendEngine():
  PortfolioDividendEngineState {
  const livePortfolio =
    useLivePortfolioEngineSnapshot();

  const portfolio =
    livePortfolio
      .engineResult
      .snapshot;

  const payload =
    useMemo(
      () =>
        createPortfolioDividendApiPayload(
          portfolio,
          false,
        ),
      [
        portfolio,
      ],
    );

  const portfolioIdentity =
    useMemo(
      () =>
        dividendPayloadIdentity(
          payload,
        ),
      [
        payload,
      ],
    );

  const [
    response,
    setResponse,
  ] = useState<
    PortfolioDividendApiResult
  >(
    emptyApiResult,
  );

  const [
    retainedResponseUsed,
    setRetainedResponseUsed,
  ] = useState(false);

  const [
    status,
    setStatus,
  ] = useState<
    PortfolioDividendDataStatus
  >("IDLE");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    lastSuccessfulAt,
    setLastSuccessfulAt,
  ] = useState<
    string | null
  >(null);

  const requestSequenceRef =
    useRef(0);

  const abortControllerRef =
    useRef<
      AbortController | null
    >(null);

  const runRequest =
    useCallback(
      async (
        forceRefresh:
          boolean,
      ) => {
        if (
          portfolio.openHoldings
            .length === 0
        ) {
          setResponse(
            emptyApiResult(),
          );

          setRetainedResponseUsed(
            false,
          );

          setStatus(
            "EMPTY",
          );

          setLoading(
            false,
          );

          setRefreshing(
            false,
          );

          setError(
            null,
          );

          return;
        }

        requestSequenceRef.current +=
          1;

        const sequence =
          requestSequenceRef.current;

        abortControllerRef.current
          ?.abort();

        const controller =
          new AbortController();

        abortControllerRef.current =
          controller;

        if (forceRefresh) {
          setRefreshing(
            true,
          );
        } else {
          setLoading(
            true,
          );
        }

        setStatus(
          "LOADING",
        );

        setError(
          null,
        );

        const requestPayload = {
          ...createPortfolioDividendApiPayload(
            portfolio,
            forceRefresh,
          ),
        };

        try {
          const result =
            await requestDividendIntelligence({
              payload:
                requestPayload,

              signal:
                controller.signal,
            });

          if (
            sequence !==
            requestSequenceRef.current
          ) {
            return;
          }

          setResponse(
            result,
          );

          setRetainedResponseUsed(
            false,
          );

          setStatus(
            result.unresolvedSymbols
              .length > 0
              ? "DEGRADED"
              : "READY",
          );

          const successfulAt =
            new Date().toISOString();

          setLastSuccessfulAt(
            successfulAt,
          );

          saveRetainedDividendResponse({
            portfolioIdentity,

            response:
              result,
          });
        } catch (
          requestError
        ) {
          if (
            controller.signal
              .aborted
          ) {
            return;
          }

          if (
            sequence !==
            requestSequenceRef.current
          ) {
            return;
          }

          const retained =
            loadRetainedDividendResponse(
              portfolioIdentity,
            );

          if (retained) {
            setResponse(
              retained,
            );

            setRetainedResponseUsed(
              true,
            );

            setStatus(
              "DEGRADED",
            );

            setError(
              requestError instanceof
                Error
                ? requestError.message
                : "Dividend provider request failed. The last successful result was retained.",
            );

            return;
          }

          setResponse(
            emptyApiResult(),
          );

          setRetainedResponseUsed(
            false,
          );

          setStatus(
            "ERROR",
          );

          setError(
            requestError instanceof
              Error
              ? requestError.message
              : "Dividend intelligence request failed.",
          );
        } finally {
          if (
            sequence ===
            requestSequenceRef.current
          ) {
            setLoading(
              false,
            );

            setRefreshing(
              false,
            );
          }
        }
      },
      [
        portfolio,
        portfolioIdentity,
      ],
    );

  useEffect(() => {
    void runRequest(
      false,
    );

    return () => {
      abortControllerRef.current
        ?.abort();
    };
  }, [
    portfolioIdentity,
    runRequest,
  ]);

  const dividendSnapshot:
    PortfolioDividendSnapshot =
      useMemo(
        () =>
          buildPortfolioDividendSnapshot({
            portfolio,

            events:
              response.events,

            eligibility:
              response.eligibility,

            providerSummary:
              response.summary,

            providersUsed:
              response.providersUsed,

            unresolvedSymbols:
              response.unresolvedSymbols,

            generatedAt:
              response.summary
                .generatedAt ||
              new Date()
                .toISOString(),

            retainedResponseUsed,

            warnings:
              response.message
                ? [
                    response.message,
                  ]
                : [],

            errors:
              error
                ? [
                    error,
                  ]
                : [],
          }),
        [
          portfolio,
          response,
          retainedResponseUsed,
          error,
        ],
      );

  return {
    portfolio,

    dividendSnapshot,

    status,

    loading,

    refreshing,

    error,

    lastSuccessfulAt,

    refresh:
      async () => {
        await runRequest(
          false,
        );
      },

    forceRefresh:
      async () => {
        await runRequest(
          true,
        );
      },
  };
}
