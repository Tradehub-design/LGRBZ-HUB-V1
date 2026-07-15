"use client";

import {
  useMemo,
} from "react";
import type {
  MarketDataExchange,
} from "@/lib/market-data/marketDataTypes";
import {
  LiveQuoteIntegrationPanel,
  type LiveQuoteIntegrationItem,
} from "./LiveQuoteIntegrationPanel";

type WatchlistLiveQuotePanelProps = {
  items:
    readonly unknown[];
};

type UnknownRecord =
  Record<
    string,
    unknown
  >;

function record(
  value:
    unknown
): UnknownRecord {
  return (
    value &&
    typeof value ===
      "object"
      ? value
      : {}
  ) as
    UnknownRecord;
}

function text(
  source:
    UnknownRecord,
  keys:
    string[]
): string {
  for (
    const key of
    keys
  ) {
    const value =
      source[
        key
      ];

    if (
      typeof value ===
        "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}

function number(
  source:
    UnknownRecord,
  keys:
    string[]
): number | null {
  for (
    const key of
    keys
  ) {
    const value =
      Number(
        source[
          key
        ]
      );

    if (
      Number.isFinite(
        value
      )
    ) {
      return value;
    }
  }

  return null;
}

function inferExchange(
  symbol:
    string,
  source:
    UnknownRecord
): MarketDataExchange {
  const explicit =
    text(
      source,
      [
        "exchange",
        "market",
      ]
    )
      .toUpperCase();

  const supported:
    MarketDataExchange[] = [
    "ASX",
    "NASDAQ",
    "NYSE",
    "NYSE_ARCA",
    "AMEX",
    "TSX",
    "LSE",
    "NZX",
    "HKEX",
    "TSE",
    "CRYPTO",
    "FOREX",
    "OTC",
    "UNKNOWN",
  ];

  if (
    supported.includes(
      explicit as
        MarketDataExchange
    )
  ) {
    return explicit as
      MarketDataExchange;
  }

  if (
    symbol.endsWith(
      ".AX"
    )
  ) {
    return "ASX";
  }

  if (
    symbol.endsWith(
      ".L"
    )
  ) {
    return "LSE";
  }

  if (
    symbol.endsWith(
      ".TO"
    )
  ) {
    return "TSX";
  }

  if (
    symbol.endsWith(
      ".NZ"
    )
  ) {
    return "NZX";
  }

  if (
    symbol.endsWith(
      ".HK"
    )
  ) {
    return "HKEX";
  }

  if (
    symbol.includes(
      "/"
    ) ||
    symbol.endsWith(
      "=X"
    )
  ) {
    return "FOREX";
  }

  if (
    [
      "BTC",
      "ETH",
      "SOL",
      "XRP",
    ].includes(
      symbol
    ) ||
    symbol.endsWith(
      "-USD"
    )
  ) {
    return "CRYPTO";
  }

  return "UNKNOWN";
}

export function normaliseWatchlistLiveQuoteItem(
  value:
    unknown
): LiveQuoteIntegrationItem | null {
  const source =
    record(
      value
    );

  const symbol =
    text(
      source,
      [
        "symbol",
        "ticker",
        "code",
        "asset",
        "instrument",
      ]
    )
      .toUpperCase();

  if (
    !symbol
  ) {
    return null;
  }

  return {
    symbol,

    name:
      text(
        source,
        [
          "name",
          "companyName",
          "securityName",
          "description",
        ]
      ) ||
      symbol,

    targetPrice:
      number(
        source,
        [
          "targetPrice",
          "target",
          "priceTarget",
          "alertPrice",
          "buyBelow",
        ]
      ),

    theme:
      text(
        source,
        [
          "theme",
          "group",
          "category",
          "strategy",
          "reason",
        ]
      ) ||
      null,

    sector:
      text(
        source,
        [
          "sector",
          "industry",
          "assetClass",
        ]
      ) ||
      null,

    exchange:
      inferExchange(
        symbol,
        source
      ),

    original:
      value,
  };
}

export function WatchlistLiveQuotePanel({
  items: rawItems,
}: WatchlistLiveQuotePanelProps) {
  const items =
    useMemo(
      () =>
        rawItems
          .map(
            normaliseWatchlistLiveQuoteItem
          )
          .filter(
            (
              item
            ): item is LiveQuoteIntegrationItem =>
              Boolean(
                item
              )
          ),
      [
        rawItems,
      ]
    );

  return (
    <LiveQuoteIntegrationPanel
      mode="WATCHLIST"
      eyebrow="Live Opportunity Monitor"
      title="Watchlist Live Market Intelligence"
      description="Live and delayed quotes, provider quality, daily movement, target-price opportunity and market-state-aware refresh."
      items={items}
      emptyMessage="No watchlist symbols are currently available for live pricing."
      maximumVisibleRows={15}
    />
  );
}
