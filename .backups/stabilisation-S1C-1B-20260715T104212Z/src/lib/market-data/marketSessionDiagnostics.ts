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


export type MarketHoursDiagnosticSummary = {
  generatedAt: string;
  exchangeCount: number;
  openExchangeCount: number;
  closedExchangeCount: number;
  sessions: unknown[];
  warnings: string[];
};

export function createMarketHoursDiagnosticSummary(
  sessions: unknown[] = [],
  warnings: string[] = []
): MarketHoursDiagnosticSummary {
  const safeSessions =
    Array.isArray(sessions)
      ? sessions
      : [];

  const openExchangeCount =
    safeSessions.filter(
      session => {
        if (
          !session ||
          typeof session !== "object"
        ) {
          return false;
        }

        const item =
          session as Record<
            string,
            unknown
          >;

        return (
          item.isMarketOpen === true ||
          item.marketOpen === true
        );
      }
    ).length;

  return {
    generatedAt:
      new Date().toISOString(),

    exchangeCount:
      safeSessions.length,

    openExchangeCount,

    closedExchangeCount:
      Math.max(
        0,
        safeSessions.length -
          openExchangeCount
      ),

    sessions:
      safeSessions,

    warnings:
      Array.isArray(warnings)
        ? warnings
        : [],
  };
}
