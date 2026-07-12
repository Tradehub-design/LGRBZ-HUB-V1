"use client";

import {
  useMemo,
} from "react";
import type {
  DividendHolding,
  DividendTransaction,
} from "@/lib/dividend-data";
import {
  DividendCentreConnected,
} from "./DividendCentreConnected";

type UnknownRecord =
  Record<
    string,
    unknown
  >;

type Props = {
  holdings?: unknown;
  transactions?: unknown;
  portfolio?: unknown;
  dashboard?: unknown;
  snapshot?: unknown;
  data?: unknown;
  baseCurrency?: string;
};

function isRecord(
  value: unknown
): value is UnknownRecord {
  return (
    Boolean(value) &&
    typeof value ===
      "object" &&
    !Array.isArray(value)
  );
}

function readArray(
  sources: unknown[],
  keys: string[]
) {
  for (
    const source of
    sources
  ) {
    if (
      Array.isArray(
        source
      )
    ) {
      return source;
    }

    if (
      !isRecord(
        source
      )
    ) {
      continue;
    }

    for (
      const key of keys
    ) {
      const value =
        source[key];

      if (
        Array.isArray(
          value
        )
      ) {
        return value;
      }
    }
  }

  return [];
}

function numberValue(
  value: unknown,
  fallback = 0
) {
  const parsed =
    Number(value);

  return Number.isFinite(
    parsed
  )
    ? parsed
    : fallback;
}

function stringValue(
  value: unknown,
  fallback = ""
) {
  return typeof value ===
    "string"
    ? value
    : fallback;
}

function adaptHolding(
  value: unknown,
  index: number
): DividendHolding | null {
  if (
    !isRecord(
      value
    )
  ) {
    return null;
  }

  const symbol =
    stringValue(
      value.symbol ||
      value.ticker ||
      value.code
    )
      .trim()
      .toUpperCase();

  if (!symbol) {
    return null;
  }

  return {
    id:
      stringValue(
        value.id,
        `holding-${index}`
      ),
    symbol,
    exchange:
      stringValue(
        value.exchange
      ) ||
      null,
    currency:
      stringValue(
        value.currency,
        "AUD"
      ),
    quantity:
      numberValue(
        value.quantity ??
        value.shares ??
        value.units
      ),
    averageCost:
      numberValue(
        value.averageCost ??
        value.avgCost ??
        value.averagePrice ??
        value.costPrice
      ),
    currentPrice:
      numberValue(
        value.currentPrice ??
        value.price ??
        value.marketPrice
      ),
    openedAt:
      stringValue(
        value.openedAt ??
        value.purchaseDate
      ) ||
      null,
    closedAt:
      stringValue(
        value.closedAt
      ) ||
      null,
    account:
      stringValue(
        value.account ??
        value.accountName
      ) ||
      null,
    broker:
      stringValue(
        value.broker
      ) ||
      null,
  };
}

function adaptTransaction(
  value: unknown,
  index: number
): DividendTransaction | null {
  if (
    !isRecord(
      value
    )
  ) {
    return null;
  }

  const symbol =
    stringValue(
      value.symbol ||
      value.ticker ||
      value.code
    )
      .trim()
      .toUpperCase();

  const date =
    stringValue(
      value.date ||
      value.transactionDate ||
      value.tradeDate
    );

  if (
    !symbol ||
    !date
  ) {
    return null;
  }

  return {
    id:
      stringValue(
        value.id,
        `transaction-${index}`
      ),
    symbol,
    type:
      stringValue(
        value.type ||
        value.transactionType
      ) ||
      null,
    date,
    quantity:
      numberValue(
        value.quantity ??
        value.shares ??
        value.units
      ),
    amount:
      numberValue(
        value.amount ??
        value.total ??
        value.cashAmount
      ),
    dividendPerShare:
      numberValue(
        value.dividendPerShare ??
        value.rate
      ),
    currency:
      stringValue(
        value.currency,
        "AUD"
      ),
    note:
      stringValue(
        value.note ??
        value.notes
      ) ||
      null,
  };
}

export function DividendCentreRouteBridge({
  holdings,
  transactions,
  portfolio,
  dashboard,
  snapshot,
  data,
  baseCurrency =
    "AUD",
}: Props) {
  const sources = [
    holdings,
    portfolio,
    dashboard,
    snapshot,
    data,
  ];

  const transactionSources = [
    transactions,
    portfolio,
    dashboard,
    snapshot,
    data,
  ];

  const resolvedHoldings =
    useMemo(
      () =>
        readArray(
          sources,
          [
            "holdings",
            "positions",
            "portfolioHoldings",
          ]
        )
          .map(
            adaptHolding
          )
          .filter(
            (
              holding
            ): holding is DividendHolding =>
              Boolean(
                holding
              )
          ),
      [
        holdings,
        portfolio,
        dashboard,
        snapshot,
        data,
      ]
    );

  const resolvedTransactions =
    useMemo(
      () =>
        readArray(
          transactionSources,
          [
            "transactions",
            "ledger",
            "recentTransactions",
          ]
        )
          .map(
            adaptTransaction
          )
          .filter(
            (
              transaction
            ): transaction is DividendTransaction =>
              Boolean(
                transaction
              )
          ),
      [
        transactions,
        portfolio,
        dashboard,
        snapshot,
        data,
      ]
    );

  return (
    <DividendCentreConnected
      holdings={
        resolvedHoldings
      }
      transactions={
        resolvedTransactions
      }
      baseCurrency={
        baseCurrency
      }
    />
  );
}
