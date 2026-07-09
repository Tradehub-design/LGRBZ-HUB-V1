import type { LedgerRow } from "./types";

export type ValidationResult = {
  passed: boolean;
  checks: {
    id: string;
    label: string;
    status: "pass" | "warning" | "fail";
    detail: string;
  }[];
};

export function validatePortfolioData(rows: LedgerRow[]): ValidationResult {
  const checks = [
    {
      id: "rows",
      label: "Transactions loaded",
      status: rows.length > 0 ? "pass" : "fail",
      detail: `${rows.length} transaction rows detected.`,
    },
    {
      id: "dates",
      label: "Dates present",
      status: rows.every((row) => Boolean(row.date)) ? "pass" : "fail",
      detail: "Every transaction should have a valid date.",
    },
    {
      id: "tickers",
      label: "Tickers present",
      status: rows.some((row) => row.assetTicker === "Unknown") ? "warning" : "pass",
      detail: "Unknown tickers should be reviewed.",
    },
    {
      id: "platforms",
      label: "Platforms present",
      status: rows.some((row) => row.platform === "Unknown") ? "warning" : "pass",
      detail: "Unknown platforms should be reviewed.",
    },
  ] as const;

  return {
    passed: checks.every((check) => check.status !== "fail"),
    checks: [...checks],
  };
}
