import type { AssetClass, CurrencyCode, RiskLevel, TransactionAction } from "@/types/portfolio";

export function cleanCell(value: unknown): string {
  return String(value ?? "")
    .replace(/\uFEFF/g, "")
    .replace(/\r/g, "")
    .trim();
}

export function normaliseNumber(value: unknown): number {
  const cleaned = cleanCell(value)
    .replace(/\$/g, "")
    .replace(/,/g, "")
    .replace(/\s/g, "")
    .replace(/[()]/g, "");

  if (!cleaned) return 0;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normaliseTicker(value: unknown): string {
  const cleaned = cleanCell(value);
  if (!cleaned) return "Unknown";
  return cleaned.toUpperCase();
}

export function normaliseCurrency(value: unknown): CurrencyCode {
  const cleaned = cleanCell(value).toUpperCase();

  if (
    cleaned === "AUD" ||
    cleaned === "USD" ||
    cleaned === "GBP" ||
    cleaned === "EUR" ||
    cleaned === "CAD" ||
    cleaned === "NZD" ||
    cleaned === "JPY" ||
    cleaned === "CNY"
  ) {
    return cleaned;
  }

  return "AUD";
}

export function normaliseAssetClass(value: unknown): AssetClass {
  const cleaned = cleanCell(value).toLowerCase();

  if (cleaned === "stock" || cleaned === "shares" || cleaned === "share") return "Stock";
  if (cleaned === "etf") return "ETF";
  if (cleaned === "crypto" || cleaned === "cryptocurrency") return "Crypto";
  if (cleaned === "cash") return "Cash";
  if (cleaned === "bond") return "Bond";
  if (cleaned === "fund") return "Fund";

  return "Other";
}

export function normaliseRisk(value: unknown): RiskLevel {
  const cleaned = cleanCell(value).toLowerCase();

  if (cleaned.includes("low")) return "Low Risk";
  if (cleaned.includes("medium")) return "Medium Risk";
  if (cleaned.includes("high")) return "High Risk";
  if (cleaned.includes("dividend")) return "Dividend";

  return "Unrated";
}

export function normaliseAction(value: unknown): TransactionAction {
  const cleaned = cleanCell(value).toLowerCase();

  if (cleaned === "buy") return "Buy";
  if (cleaned === "sell") return "Sell";
  if (cleaned === "cash deposit") return "Cash Deposit";
  if (cleaned === "cash withdrawal") return "Cash Withdrawal";
  if (cleaned === "transfer send") return "Transfer Send";
  if (cleaned === "transfer deposit") return "Transfer Deposit";
  if (cleaned === "cash dividend") return "Cash Dividend";
  if (cleaned === "cash interest") return "Cash Interest";
  if (cleaned === "fee") return "Fee";
  if (cleaned === "fx") return "FX";
  if (cleaned === "adjustment") return "Adjustment";

  return "Other";
}

export function getCell(row: Record<string, string>, possibleNames: string[]): string {
  for (const name of possibleNames) {
    if (row[name] !== undefined) return row[name];

    const foundKey = Object.keys(row).find(
      (key) => key.trim().toLowerCase() === name.trim().toLowerCase(),
    );

    if (foundKey) return row[foundKey];
  }

  return "";
}
