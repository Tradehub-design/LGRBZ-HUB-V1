import type { CurrencyCode, MasterTransaction } from "./types";

function n(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function s(value: unknown, fallback = ""): string {
  const text = String(value ?? "").trim();
  return text || fallback;
}

export function normaliseTransaction(input: any, index = 0): MasterTransaction {
  const ticker = s(input.ticker ?? input.assetTicker ?? input["Asset Ticker"], "CASH").toUpperCase();

  const quantity = n(input.quantity ?? input.Quantity);
  const price = n(input.price ?? input.priceAud ?? input.Price);
  const fees = n(input.fees ?? input.fiatFees ?? input["Fiat Fees"]);
  const total = n(input.total ?? input.totalAud ?? input.amountAud ?? input.Total ?? quantity * price + fees);

  return {
    id: s(input.id, `tx-${index + 1}-${ticker}-${s(input.date ?? input.Date, "unknown")}`),
    source: input.source === "manual" ? "manual" : "excel-seed",
    sourceRow: n(input.sourceRow ?? input.rowNumber ?? index + 2),
    date: s(input.date ?? input.Date),
    action: s(input.action ?? input.Action, "Other"),
    ticker,
    assetTicker: ticker,
    quantity,
    price,
    fees,
    total,
    currency: s(input.currency ?? input.Currency, "AUD") as CurrencyCode,
    platform: s(input.platform ?? input.Platform, "Manual"),
    assetClass: s(input.assetClass ?? input["Asset Class"], "Stock"),
    sector: s(input.sector ?? input.Sector, "Unknown"),
    country: s(input.country ?? input.Country, "Australia"),
    strategy: s(input.strategy ?? input.Strategy, "Manual"),
    notes: s(input.notes ?? input.Notes),
    raw: input.raw ?? input,
  };
}

export function normaliseTransactions(rows: any[]): MasterTransaction[] {
  return rows
    .map((row, index) => normaliseTransaction(row, index))
    .filter((tx) => tx.date && tx.action && tx.ticker);
}
