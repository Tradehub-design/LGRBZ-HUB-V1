"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  usePortfolioStore,
  type LedgerRow,
} from "@/store/portfolioStore";

import {
  loadTxLedger,
} from "@/lib/transactions/ledgerStorage";

import {
  buildPortfolioEngineFromRaw,
  type PortfolioEngineResult,
} from "../engine";

import {
  ledgerRowsToRawPortfolioTransactions,
} from "../adapters/ledger-row-adapter";

export type PortfolioEngineSnapshotState = {
  engineResult:
    PortfolioEngineResult;

  transactions:
    LedgerRow[];

  source:
    "portfolio-store" |
    "transaction-ledger" |
    "empty";

  hydrated:
    boolean;
};

function uniqueRows(
  rows: readonly LedgerRow[],
): LedgerRow[] {
  const result:
    LedgerRow[] = [];

  const seen =
    new Set<string>();

  rows.forEach(
    (
      row,
      index,
    ) => {
      const id =
        String(
          row.id ??
          "",
        ).trim();

      const fallbackIdentity = [
        row.date,
        row.action,
        row.ticker ??
          row.assetTicker,
        row.quantity,
        row.price,
        row.total,
        row.platform,
        index,
      ].join("::");

      const key =
        id || fallbackIdentity;

      if (seen.has(key)) {
        return;
      }

      seen.add(key);
      result.push(row);
    },
  );

  return result;
}

export function usePortfolioEngineSnapshot():
  PortfolioEngineSnapshotState {
  const storeTransactions =
    usePortfolioStore(
      (state) =>
        state.transactions,
    );

  const loaded =
    usePortfolioStore(
      (state) =>
        state.loaded,
    );

  const [
    persistedTransactions,
    setPersistedTransactions,
  ] = useState<LedgerRow[]>([]);

  const [
    hydrated,
    setHydrated,
  ] = useState(false);

  useEffect(() => {
    setPersistedTransactions(
      loadTxLedger(),
    );

    setHydrated(true);
  }, []);

  const source:
    PortfolioEngineSnapshotState["source"] =
      storeTransactions.length > 0
        ? "portfolio-store"
        : persistedTransactions.length > 0
          ? "transaction-ledger"
          : "empty";

  const transactions =
    useMemo(
      () =>
        uniqueRows(
          storeTransactions.length > 0
            ? storeTransactions
            : persistedTransactions,
        ),
      [
        storeTransactions,
        persistedTransactions,
      ],
    );

  const engineResult =
    useMemo(
      () =>
        buildPortfolioEngineFromRaw({
          rawTransactions:
            ledgerRowsToRawPortfolioTransactions(
              transactions,
            ),

          costBasisMethod:
            "AVERAGE",

          generatedAt:
            new Date().toISOString(),

          ledgerOptions: {
            source:
              source ===
              "transaction-ledger"
                ? "excel-seed"
                : "manual",
          },
        }),
      [
        transactions,
        source,
      ],
    );

  return {
    engineResult,

    transactions,

    source:

      /**
       * loaded may be false during the first Zustand hydration pass.
       * persisted ledger hydration remains the final client-side readiness
       * signal for legacy localStorage records.
       */
      !loaded &&
      !hydrated
        ? "empty"
        : source,

    hydrated,
  };
}
