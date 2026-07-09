import type { LedgerRow } from "@/lib/portfolio-engine/types";

export function mapLedgerRowToDb(row: LedgerRow, portfolioId: string) {
  return {
    portfolio_id: portfolioId,
    transaction_date: row.date,
    action: row.action,
    ticker: row.assetTicker,
    quantity: row.quantity,
    price: row.price,
    fees: row.fiatFees,
    currency: row.currency || "AUD",
    platform: row.platform,
    notes: row.notes,
  };
}
