"use client";

import {
  useMemo,
} from "react";
import {
  useLiveMarketQuotes,
  type UseLiveMarketQuotesOptions,
} from "./useLiveMarketQuotes";

export type PortfolioQuotePosition = {
  symbol: string;
  quantity: number;

  costBasis?: number | null;

  currency?: string | null;
};

export function usePortfolioLiveQuotes(
  positions:
    PortfolioQuotePosition[],
  options:
    UseLiveMarketQuotesOptions = {}
) {
  const symbols =
    useMemo(
      () =>
        Array.from(
          new Set(
            positions
              .map(
                (
                  position
                ) =>
                  position.symbol
                    .trim()
                    .toUpperCase()
              )
              .filter(
                Boolean
              )
          )
        ),
      [
        positions,
      ]
    );

  const live =
    useLiveMarketQuotes(
      symbols,
      options
    );

  const valuations =
    useMemo(
      () =>
        positions.map(
          (
            position
          ) => {
            const symbol =
              position.symbol
                .trim()
                .toUpperCase();

            const quote =
              live.quoteBySymbol[
                symbol
              ] ||
              null;

            const marketValue =
              quote
                ? position.quantity *
                  quote.price
                : null;

            const costBasis =
              position.costBasis ??
              null;

            const gainLoss =
              marketValue !==
                null &&
              costBasis !==
                null
                ? marketValue -
                  costBasis
                : null;

            const gainLossPercent =
              gainLoss !==
                null &&
              costBasis !==
                null &&
              costBasis !==
                0
                ? (
                    gainLoss /
                    costBasis
                  ) *
                  100
                : null;

            return {
              ...position,

              symbol,

              quote,

              marketValue,
              costBasis,
              gainLoss,
              gainLossPercent,

              provider:
                quote?.provider ||
                null,

              freshness:
                quote?.freshness ||
                null,

              qualityScore:
                quote?.qualityScore ||
                null,
            };
          }
        ),
      [
        live.quoteBySymbol,
        positions,
      ]
    );

  const totals =
    useMemo(
      () => {
        const marketValue =
          valuations.reduce(
            (
              total,
              position
            ) =>
              total +
              (
                position.marketValue ||
                0
              ),
            0
          );

        const costBasis =
          valuations.reduce(
            (
              total,
              position
            ) =>
              total +
              (
                position.costBasis ||
                0
              ),
            0
          );

        const gainLoss =
          marketValue -
          costBasis;

        const gainLossPercent =
          costBasis !==
          0
            ? (
                gainLoss /
                costBasis
              ) *
              100
            : 0;

        const pricedPositionCount =
          valuations.filter(
            (
              position
            ) =>
              position.marketValue !==
              null
          ).length;

        return {
          marketValue,
          costBasis,
          gainLoss,
          gainLossPercent,

          positionCount:
            valuations.length,

          pricedPositionCount,

          unpricedPositionCount:
            valuations.length -
            pricedPositionCount,

          pricingCoveragePercent:
            valuations.length >
            0
              ? (
                  pricedPositionCount /
                  valuations.length
                ) *
                100
              : 100,
        };
      },
      [
        valuations,
      ]
    );

  return {
    ...live,

    positions:
      valuations,

    totals,
  };
}
