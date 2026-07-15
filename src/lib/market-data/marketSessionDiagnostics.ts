import type {
  MarketDataExchange,
} from "./marketDataTypes";
import {
  supportedTradingCalendarExchanges,
} from "./exchangeTradingCalendar";
import {
  createMarketSessionSnapshot,
} from "./marketClock";
import type {
  ExchangeHolidayOverride,
  MarketSessionDiagnosticSummary,
} from "./marketSessionTypes";

export function createMarketSessionDiagnosticSummary({
  exchanges =
    supportedTradingCalendarExchanges(),
  now =
    new Date(),
  holidays = [],
  haltedExchanges = [],
}: {
  exchanges?:
    MarketDataExchange[];

  now?: Date;

  holidays?:
    ExchangeHolidayOverride[];

  haltedExchanges?:
    MarketDataExchange[];
} = {}): MarketSessionDiagnosticSummary {
  const snapshots =
    exchanges.map(
      (
        exchange
      ) =>
        createMarketSessionSnapshot({
          exchange,
          now,
          holidays,

          tradingHalted:
            haltedExchanges.includes(
              exchange
            ),
        })
    );

  return {
    generatedAt:
      now.toISOString(),

    exchangeCount:
      snapshots.length,

    openExchangeCount:
      snapshots.filter(
        (
          snapshot
        ) =>
          snapshot.marketOpen
      ).length,

    closedExchangeCount:
      snapshots.filter(
        (
          snapshot
        ) =>
          snapshot.marketClosed
      ).length,

    continuousExchangeCount:
      snapshots.filter(
        (
          snapshot
        ) =>
          snapshot.continuous
      ).length,

    haltedExchangeCount:
      snapshots.filter(
        (
          snapshot
        ) =>
          snapshot
            .tradingHalted
      ).length,

    preMarketExchangeCount:
      snapshots.filter(
        (
          snapshot
        ) =>
          snapshot
            .sessionType ===
          "PRE_MARKET"
      ).length,

    regularSessionExchangeCount:
      snapshots.filter(
        (
          snapshot
        ) =>
          snapshot
            .sessionType ===
          "REGULAR"
      ).length,

    afterHoursExchangeCount:
      snapshots.filter(
        (
          snapshot
        ) =>
          snapshot
            .sessionType ===
          "AFTER_HOURS"
      ).length,

    exchanges:
      snapshots,
  };
}
