import type { CurrencyCode } from "@/types/portfolio";

export function formatCurrency(
  value: number | null | undefined,
  currency: CurrencyCode | "AUD" | "USD" = "AUD",
  maximumFractionDigits = 2,
) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(safeValue);
}

export function formatNumber(value: number | null | undefined, maximumFractionDigits = 2) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;

  return new Intl.NumberFormat("en-AU", {
    maximumFractionDigits,
  }).format(safeValue);
}

export function formatPercent(value: number | null | undefined, maximumFractionDigits = 2) {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;

  return `${safeValue >= 0 ? "+" : ""}${safeValue.toFixed(maximumFractionDigits)}%`;
}

export function formatCompactCurrency(value: number | null | undefined, currency: CurrencyCode = "AUD") {
  const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;

  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(safeValue);
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(value: string | Date | null | undefined) {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
  }).format(date);
}
