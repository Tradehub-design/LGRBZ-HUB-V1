#!/usr/bin/env bash
set -e

echo "🔧 Transaction Ledger Fix Bash 1/4: stable source of truth..."

mkdir -p src/lib/transactions

cat > src/lib/transactions/ledgerStorage.ts <<'TS'
import type { LedgerRow } from "@/store/portfolioStore";

export const TX_LEDGER_STORAGE_KEY = "lgrbz.tx.ledger.v1";

export function loadTxLedger(): LedgerRow[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(TX_LEDGER_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.removeItem(TX_LEDGER_STORAGE_KEY);
    return [];
  }
}

export function saveTxLedger(rows: LedgerRow[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TX_LEDGER_STORAGE_KEY, JSON.stringify(rows));
}

export function clearTxLedger() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TX_LEDGER_STORAGE_KEY);
  window.localStorage.removeItem("lgrbz.masterTransactions.v1");
  window.localStorage.removeItem("lgrbz.portfolio.v2.transactions");
}
TS

cat > src/lib/transactions/normaliseLedgerRow.ts <<'TS'
import type { CurrencyCode, LedgerRow } from "@/store/portfolioStore";

function n(value: unknown): number {
  const cleaned = String(value ?? "")
    .replace(/,/g, "")
    .replace(/\$/g, "")
    .replace(/%/g, "")
    .trim();

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function s(value: unknown, fallback = ""): string {
  const output = String(value ?? "").trim();
  return output || fallback;
}

export function normaliseLedgerRow(input: any, index = 0): LedgerRow {
  const ticker = s(input.ticker ?? input.assetTicker ?? input["Asset Ticker"], "CASH").toUpperCase();
  const quantity = n(input.quantity ?? input.Quantity);
  const price = n(input.price ?? input.priceAud ?? input.Price);
  const fees = n(input.fees ?? input.fiatFees ?? input["Fiat Fees"]);
  const total = n(input.total ?? input.totalAud ?? input.amountAud ?? input.Total ?? quantity * price + fees);

  return {
    id: s(input.id, `tx-${Date.now()}-${index}`),
    raw: input.raw ?? input,
    rowNumber: n(input.rowNumber ?? index + 1),
    source: s(input.source, "manual"),
    sourceRow: n(input.sourceRow ?? index + 1),
    date: s(input.date ?? input.Date),
    action: s(input.action ?? input.Action, "Other"),
    type: s(input.type ?? input.action ?? input.Action, "Other"),
    assetTicker: ticker,
    ticker,
    platform: s(input.platform ?? input.Platform, "Manual"),
    currency: s(input.currency ?? input.Currency, "AUD") as CurrencyCode,
    quantity,
    price,
    priceAud: n(input.priceAud ?? price),
    marketPriceAud: n(input.marketPriceAud ?? price),
    fiatFees: fees,
    fees,
    feesAud: n(input.feesAud ?? fees),
    total,
    totalAud: n(input.totalAud ?? total),
    totalFeesIncluded: n(input.totalFeesIncluded ?? total),
    totalFeesIncludedAud: n(input.totalFeesIncludedAud ?? total),
    amount: n(input.amount ?? total),
    amountAud: n(input.amountAud ?? total),
    assetClass: s(input.assetClass ?? input["Asset Class"], "Stock"),
    sector: s(input.sector ?? input.Sector, "Unknown"),
    country: s(input.country ?? input.Country, "Australia"),
    strategy: s(input.strategy ?? input.Strategy, "Manual"),
    notes: s(input.notes ?? input.Notes),
  };
}

export function normaliseLedgerRows(rows: any[]): LedgerRow[] {
  return rows
    .map((row, index) => normaliseLedgerRow(row, index))
    .filter((row) => row.date && row.action && row.ticker);
}
TS

cat > src/lib/transactions/applyLedger.ts <<'TS'
import type { LedgerRow } from "@/store/portfolioStore";
import { usePortfolioStore } from "@/store/portfolioStore";
import { buildEngineFromTransactions } from "@/lib/portfolio/buildEngineFromTransactions";
import { normaliseLedgerRows } from "./normaliseLedgerRow";
import { saveTxLedger } from "./ledgerStorage";

export function applyLedger(rows: any[], source = "transaction-ledger") {
  const transactions: LedgerRow[] = normaliseLedgerRows(rows);
  const engine = buildEngineFromTransactions(transactions);

  usePortfolioStore.setState({
    loaded: true,
    rawLedgerCsv: source,
    engine,
    portfolio: engine.portfolio,
    transactions: engine.transactions,
    holdings: engine.holdings,
    openHoldings: engine.openHoldings,
    closedHoldings: engine.closedHoldings,
    dividends: engine.dividends,
    cashAccounts: engine.cashAccounts,
  });

  saveTxLedger(engine.transactions);

  return engine;
}
TS

cat > src/providers/PortfolioPersistenceProvider.tsx <<'TSX'
"use client";

import { useEffect, useRef } from "react";
import { applyLedger } from "@/lib/transactions/applyLedger";
import { loadTxLedger } from "@/lib/transactions/ledgerStorage";

export default function PortfolioPersistenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const saved = loadTxLedger();

    if (saved.length > 0) {
      applyLedger(saved, "local-ledger");
    }
  }, []);

  return <>{children}</>;
}
TSX

npm run build
