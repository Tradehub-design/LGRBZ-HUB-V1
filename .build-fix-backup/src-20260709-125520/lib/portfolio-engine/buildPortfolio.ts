import { calculateAllocations } from "./allocations";
import { calculateCashAccounts } from "./cash";
import { calculateDividends } from "./dividends";
import { calculateHoldings } from "./holdings";
import { calculateMemberContributions } from "./contributions";
import { parseMasterLedger } from "./parser";
import { buildSummary } from "./summary";
import type { PortfolioEngineResult } from "./types";

export function buildPortfolio(csv: string): PortfolioEngineResult {
  const parsed = parseMasterLedger(csv);

  const holdings = calculateHoldings(parsed.rows);
  const cashAccounts = calculateCashAccounts(parsed.rows);
  const dividends = calculateDividends(parsed.rows);
  const memberContributions = calculateMemberContributions(parsed.rows);
  const allocation = calculateAllocations(holdings);
  const summary = buildSummary(parsed.rows, holdings, cashAccounts, dividends);

  return {
    generatedAt: new Date().toISOString(),
    sourceRows: parsed.rows.length + parsed.issues.length,
    validRows: parsed.rows.length,
    invalidRows: parsed.issues,
    transactions: parsed.rows,
    holdings,
    cashAccounts,
    dividends,
    memberContributions,
    allocation,
    summary,
  };
}
