import type { DividendRecord, LedgerRow } from "./types";

export function calculateDividends(rows: LedgerRow[]): DividendRecord[] {
  return rows
    .filter((row) => row.action === "Cash Dividend" || row.action === "Cash Interest")
    .map((row) => ({
      id: row.id,
      date: row.date,
      ticker: row.assetTicker,
      platform: row.platform,
      amountAud: row.totalFeesIncludedAud || row.totalAud || row.price || 0,
      currency: row.currency,
      sector: row.sector,
      country: row.country,
      notes: row.notes,
    }));
}
