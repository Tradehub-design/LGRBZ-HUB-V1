import type { AllocationSlice } from "./types";

export type CountryInsight = {
  id: string;
  country: string;
  percent: number;
  message: string;
  severity: "good" | "watch" | "risk";
};

export function buildCountryInsights(countries: AllocationSlice[]): CountryInsight[] {
  return countries.map((country) => {
    const severity = country.percent > 75 ? "risk" : country.percent > 55 ? "watch" : "good";

    return {
      id: country.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      country: country.label,
      percent: country.percent,
      severity,
      message:
        severity === "risk"
          ? "Country exposure is highly concentrated."
          : severity === "watch"
            ? "Country exposure is meaningful and should be monitored."
            : "Country exposure appears balanced.",
    };
  });
}
