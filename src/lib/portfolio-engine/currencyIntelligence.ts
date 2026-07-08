import type { AllocationSlice } from "./types";

export type CurrencyInsight = {
  id: string;
  currency: string;
  percent: number;
  message: string;
  severity: "good" | "watch" | "risk";
};

export function buildCurrencyInsights(currencies: AllocationSlice[]): CurrencyInsight[] {
  return currencies.map((currency) => {
    const severity = currency.percent > 70 ? "risk" : currency.percent > 45 ? "watch" : "good";

    return {
      id: currency.label.toLowerCase(),
      currency: currency.label,
      percent: currency.percent,
      severity,
      message:
        severity === "risk"
          ? "Currency exposure is highly concentrated."
          : severity === "watch"
            ? "Currency exposure is meaningful and should be monitored."
            : "Currency exposure appears balanced.",
    };
  });
}
