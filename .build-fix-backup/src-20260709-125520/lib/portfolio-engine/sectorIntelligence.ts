import type { AllocationSlice } from "./types";

export type SectorInsight = {
  id: string;
  sector: string;
  percent: number;
  message: string;
  severity: "good" | "watch" | "risk";
};

export function buildSectorInsights(sectors: AllocationSlice[]): SectorInsight[] {
  return sectors.map((sector) => {
    const severity = sector.percent > 40 ? "risk" : sector.percent > 25 ? "watch" : "good";

    return {
      id: sector.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      sector: sector.label,
      percent: sector.percent,
      severity,
      message:
        severity === "risk"
          ? "This sector is carrying a high level of concentration risk."
          : severity === "watch"
            ? "This sector is meaningful and should be monitored."
            : "This sector exposure is within a balanced range.",
    };
  });
}
