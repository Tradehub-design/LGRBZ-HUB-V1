export type SafeRecord = Record<string, number | string | null | undefined>;

export function asRecord(value: unknown): SafeRecord {
  return value as SafeRecord;
}

export function getTransactionTotal(value: unknown): number {
  const record = asRecord(value);
  const quantity = Number(record.quantity ?? record.units ?? record.shares ?? 0);
  const price = Number(record.priceAud ?? record.price ?? record.unitPrice ?? record.averagePrice ?? 0);

  return (
    Math.abs(Number(getTransactionTotal(record) ?? 0)) ||
    Math.abs(Number(record.totalAud ?? 0)) ||
    Math.abs(Number(record.valueAud ?? 0)) ||
    Math.abs(Number(record.amountAud ?? 0)) ||
    Math.abs(Number(record.amount ?? 0)) ||
    Math.abs(Number(record.netAmount ?? 0)) ||
    Math.abs(quantity * price) ||
    0
  );
}

export function getTransactionTicker(value: unknown): string {
  const record = asRecord(value);
  return String(record.assetTicker ?? record.ticker ?? record.symbol ?? "Cash");
}

export function getTransactionDate(value: unknown): string {
  const record = asRecord(value);
  return String(record.date ?? record.tradeDate ?? record.createdAt ?? "");
}
