import {
  HoldingsV2Summary,
  HoldingsV2SummaryMetric,
} from "./holdingsV2Types";

function valueTone(
  value:
    | number
    | null
) {
  if (
    value === null ||
    value === 0
  ) {
    return "neutral" as const;
  }

  return value > 0
    ? "positive" as const
    : "negative" as const;
}

export function createHoldingsV2Metrics(
  summary: HoldingsV2Summary
): HoldingsV2SummaryMetric[] {
  return [
    {
      id:
        "market-value",
      label:
        "Market Value",
      value:
        summary.totalMarketValue,
      format:
        "currency",
      currency:
        summary.baseCurrency,
      decimals: 0,
      subtitle:
        "Current open positions",
      tone:
        "neutral",
    },
    {
      id:
        "cost-base",
      label:
        "Cost Base",
      value:
        summary.totalCostBase,
      format:
        "currency",
      currency:
        summary.baseCurrency,
      decimals: 0,
      subtitle:
        "Capital invested",
      tone:
        "info",
    },
    {
      id:
        "unrealised-return",
      label:
        "Unrealised Return",
      value:
        summary.totalUnrealisedGainLoss,
      format:
        "currency",
      currency:
        summary.baseCurrency,
      decimals: 0,
      comparison:
        summary.totalUnrealisedGainLossPercent,
      subtitle:
        "Open position P&L",
      tone:
        valueTone(
          summary.totalUnrealisedGainLoss
        ),
    },
    {
      id:
        "daily-return",
      label:
        "Today",
      value:
        summary.totalDailyGainLoss,
      format:
        "currency",
      currency:
        summary.baseCurrency,
      decimals: 0,
      comparison:
        summary.totalDailyGainLossPercent,
      subtitle:
        "Daily movement",
      tone:
        valueTone(
          summary.totalDailyGainLoss
        ),
    },
    {
      id:
        "holdings-count",
      label:
        "Open Holdings",
      value:
        summary.openHoldings,
      format:
        "number",
      decimals: 0,
      subtitle: `${summary.profitableHoldings} profitable · ${summary.losingHoldings} losing`,
      tone:
        "neutral",
    },
    {
      id:
        "annual-income",
      label:
        "Annual Income",
      value:
        summary.annualDividendIncome,
      format:
        "currency",
      currency:
        summary.baseCurrency,
      decimals: 0,
      subtitle:
        "Forecast dividends",
      tone:
        "positive",
    },
  ];
}
