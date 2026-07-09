import { getTransactionTotal } from "@/lib/portfolio/safeTransaction";
import type { LedgerIssue, LedgerRow } from "./types";

export type DataQualityScore = {
  score: number;
  rating: "Excellent" | "Good" | "Needs Review" | "Poor";
  issueCount: number;
  warnings: string[];
};

export function calculateDataQuality(params: {
  transactions: LedgerRow[];
  issues: LedgerIssue[];
}): DataQualityScore {
  let score = 100;
  const warnings: string[] = [];

  if (params.issues.length > 0) {
    score -= Math.min(40, params.issues.length * 5);
    warnings.push(`${params.issues.length} ledger issue(s) detected.`);
  }

  const missingTicker = params.transactions.filter((tx) => !tx.assetTicker || tx.assetTicker === "Unknown").length;
  if (missingTicker > 0) {
    score -= Math.min(20, missingTicker * 2);
    warnings.push(`${missingTicker} transaction(s) have unknown ticker.`);
  }

  const zeroAmount = params.transactions.filter((tx) => getTransactionTotal(tx) === 0 && tx.action !== "Other").length;
  if (zeroAmount > 0) {
    score -= Math.min(15, zeroAmount);
    warnings.push(`${zeroAmount} transaction(s) have zero AUD amount.`);
  }

  const unknownPlatform = params.transactions.filter((tx) => tx.platform === "Unknown").length;
  if (unknownPlatform > 0) {
    score -= Math.min(10, unknownPlatform);
    warnings.push(`${unknownPlatform} transaction(s) have unknown platform.`);
  }

  score = Math.max(0, Math.round(score));

  return {
    score,
    rating: score >= 90 ? "Excellent" : score >= 75 ? "Good" : score >= 55 ? "Needs Review" : "Poor",
    issueCount: params.issues.length + missingTicker + zeroAmount + unknownPlatform,
    warnings: warnings.length ? warnings : ["No major data quality issues detected."],
  };
}
