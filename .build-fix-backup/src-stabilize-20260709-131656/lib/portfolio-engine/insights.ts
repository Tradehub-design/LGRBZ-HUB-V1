import type { AllocationSlice, CalculatedHolding, CashAccount, DividendRecord, LedgerRow } from "./types";

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((value || 0) * factor) / factor;
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return round((value / total) * 100, 2);
}

export type PortfolioPerformance = {
  investedCostAud: number;
  cashAud: number;
  estimatedValueAud: number;
  realisedPlAud: number;
  dividendIncomeAud: number;
  totalReturnAud: number;
  totalReturnPercent: number;
  feesAud: number;
  transactionCount: number;
  positionCount: number;
};

export type PortfolioRisk = {
  riskScore: number;
  largestHoldingPercent: number;
  largestSectorPercent: number;
  largestCountryPercent: number;
  highRiskPercent: number;
  cashPercent: number;
  concentrationLevel: "Low" | "Moderate" | "High";
};

export type PortfolioHealth = {
  score: number;
  rating: "Excellent" | "Good" | "Needs Review" | "High Risk";
  recommendations: string[];
};

export function calculatePortfolioPerformance(params: {
  openHoldings: CalculatedHolding[];
  holdings: CalculatedHolding[];
  cashAccounts: CashAccount[];
  dividends: DividendRecord[];
  transactions: LedgerRow[];
}): PortfolioPerformance {
  const investedCostAud = round(
    params.openHoldings.reduce((sum, holding) => sum + holding.totalCostAud, 0),
  );

  const cashAud = round(
    params.cashAccounts.reduce((sum, account) => sum + account.balanceAud, 0),
  );

  const realisedPlAud = round(
    params.holdings.reduce((sum, holding) => sum + holding.realisedPlAud, 0),
  );

  const dividendIncomeAud = round(
    params.dividends.reduce((sum, dividend) => sum + dividend.amountAud, 0),
  );

  const feesAud = round(
    params.transactions.reduce((sum, transaction) => sum + transaction.fiatFees, 0),
  );

  const estimatedValueAud = round(investedCostAud + cashAud);
  const totalReturnAud = round(realisedPlAud + dividendIncomeAud);
  const totalReturnPercent = percent(totalReturnAud, investedCostAud);

  return {
    investedCostAud,
    cashAud,
    estimatedValueAud,
    realisedPlAud,
    dividendIncomeAud,
    totalReturnAud,
    totalReturnPercent,
    feesAud,
    transactionCount: params.transactions.length,
    positionCount: params.openHoldings.length,
  };
}

export function calculatePortfolioRisk(params: {
  openHoldings: CalculatedHolding[];
  totalCostAud: number;
  totalCashAud: number;
  sectorAllocation: AllocationSlice[];
  countryAllocation: AllocationSlice[];
  riskAllocation: AllocationSlice[];
}): PortfolioRisk {
  const largestHoldingPercent = Math.max(
    ...params.openHoldings.map((holding) => percent(holding.totalCostAud, params.totalCostAud)),
    0,
  );

  const largestSectorPercent = Math.max(...params.sectorAllocation.map((item) => item.percent), 0);
  const largestCountryPercent = Math.max(...params.countryAllocation.map((item) => item.percent), 0);

  const highRiskPercent =
    params.riskAllocation.find((item) => item.label.toLowerCase().includes("high"))?.percent ?? 0;

  const cashPercent = percent(params.totalCashAud, params.totalCostAud + params.totalCashAud);

  let riskScore = 0;

  if (largestHoldingPercent > 30) riskScore += 25;
  else if (largestHoldingPercent > 20) riskScore += 15;
  else if (largestHoldingPercent > 10) riskScore += 8;

  if (largestSectorPercent > 45) riskScore += 25;
  else if (largestSectorPercent > 30) riskScore += 15;
  else if (largestSectorPercent > 20) riskScore += 8;

  if (largestCountryPercent > 80) riskScore += 15;
  else if (largestCountryPercent > 60) riskScore += 8;

  if (highRiskPercent > 40) riskScore += 25;
  else if (highRiskPercent > 25) riskScore += 15;
  else if (highRiskPercent > 10) riskScore += 8;

  if (cashPercent < 2) riskScore += 8;
  if (cashPercent > 35) riskScore += 6;

  riskScore = Math.min(100, Math.max(0, round(riskScore, 0)));

  const concentrationLevel =
    riskScore >= 60 ? "High" : riskScore >= 30 ? "Moderate" : "Low";

  return {
    riskScore,
    largestHoldingPercent,
    largestSectorPercent,
    largestCountryPercent,
    highRiskPercent,
    cashPercent,
    concentrationLevel,
  };
}

export function calculatePortfolioHealth(params: {
  openHoldings: CalculatedHolding[];
  totalCostAud: number;
  totalCashAud: number;
  totalDividendsAud: number;
  sectorAllocation: AllocationSlice[];
  countryAllocation: AllocationSlice[];
  risk: PortfolioRisk;
}): PortfolioHealth {
  let score = 100;
  const recommendations: string[] = [];

  if (params.openHoldings.length < 5) {
    score -= 18;
    recommendations.push("Increase diversification by holding more positions.");
  } else if (params.openHoldings.length < 10) {
    score -= 8;
    recommendations.push("Portfolio is improving but could benefit from more diversification.");
  }

  if (params.risk.largestHoldingPercent > 25) {
    score -= 18;
    recommendations.push("Largest holding is carrying too much portfolio weight.");
  }

  if (params.risk.largestSectorPercent > 40) {
    score -= 14;
    recommendations.push("Sector concentration is high.");
  }

  if (params.countryAllocation.length < 2) {
    score -= 8;
    recommendations.push("Consider adding more geographic diversification.");
  }

  if (params.risk.highRiskPercent > 35) {
    score -= 14;
    recommendations.push("High-risk exposure is elevated.");
  }

  if (params.risk.cashPercent < 2) {
    score -= 6;
    recommendations.push("Cash reserve is low.");
  }

  if (params.totalDividendsAud <= 0) {
    score -= 4;
    recommendations.push("No dividend income has been recorded yet.");
  }

  score = Math.min(100, Math.max(0, round(score, 0)));

  const rating =
    score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Needs Review" : "High Risk";

  if (recommendations.length === 0) {
    recommendations.push("Portfolio structure looks healthy based on current transaction data.");
  }

  return {
    score,
    rating,
    recommendations,
  };
}
