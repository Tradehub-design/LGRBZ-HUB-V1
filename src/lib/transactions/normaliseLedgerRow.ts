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
