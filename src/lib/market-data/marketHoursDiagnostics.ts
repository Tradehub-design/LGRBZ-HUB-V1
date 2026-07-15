import {
  EXCHANGE_TRADING_SESSIONS,
} from "./exchangeTradingSessions";
import {
  getMarketClock,
} from "./marketClock";
import type {
  MarketHoursDiagnosticSummary,
} from "./marketHoursTypes";

export function createMarketHoursDiagnosticSummary(
  now =
    new Date()
): MarketHoursDiagnosticSummary {
  const exchanges =
    EXCHANGE_TRADING_SESSIONS
      .filter(
        (
          definition
        ) =>
          definition.exchange !==
          "UNKNOWN"
      )
      .map(
        (
          definition
        ) =>
          getMarketClock(
            definition.exchange,
            now
          )
      );

  return {
    generatedAt:
      now.toISOString(),

    exchangeCount:
      exchanges.length,

    openExchangeCount:
      exchanges.filter(
        (
          exchange
        ) =>
          exchange.state ===
          "OPEN"
      ).length,

    preMarketExchangeCount:
      exchanges.filter(
        (
          exchange
        ) =>
          exchange.state ===
          "PRE_MARKET"
      ).length,

    afterHoursExchangeCount:
      exchanges.filter(
        (
          exchange
        ) =>
          exchange.state ===
          "AFTER_HOURS"
      ).length,

    closedExchangeCount:
      exchanges.filter(
        (
          exchange
        ) =>
          exchange.state ===
          "CLOSED"
      ).length,

    weekendExchangeCount:
      exchanges.filter(
        (
          exchange
        ) =>
          exchange.state ===
          "WEEKEND"
      ).length,

    holidayExchangeCount:
      exchanges.filter(
        (
          exchange
        ) =>
          exchange.state ===
          "HOLIDAY"
      ).length,

    exchanges,
  };
}
