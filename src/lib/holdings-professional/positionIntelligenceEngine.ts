import type {
  CreatePositionIntelligenceInput,
  PositionHealthIndicator,
  PositionIntelligenceHealthLevel,
  PositionIntelligenceMetric,
  PositionIntelligenceSummary,
} from "./positionIntelligenceModels";

type UnknownRecord =
  Record<string, unknown>;

function record(
  value: unknown
): UnknownRecord {
  return (
    value &&
    typeof value === "object"
      ? value
      : {}
  ) as UnknownRecord;
}

function numberValue(
  source: UnknownRecord,
  keys: string[]
): number | null {
  for (const key of keys) {
    const raw =
      source[key];

    if (
      raw === undefined ||
      raw === null ||
      raw === ""
    ) {
      continue;
    }

    const parsed =
      Number(raw);

    if (
      Number.isFinite(
        parsed
      )
    ) {
      return parsed;
    }
  }

  return null;
}

function clamp(
  value: number,
  minimum = 0,
  maximum = 100
): number {
  return Math.max(
    minimum,
    Math.min(
      maximum,
      value
    )
  );
}

function safePercent(
  numerator: number,
  denominator: number
): number | null {
  if (
    denominator === 0 ||
    !Number.isFinite(numerator) ||
    !Number.isFinite(denominator)
  ) {
    return null;
  }

  return (
    numerator /
    denominator
  ) *
    100;
}

function money(
  value: number,
  currency: string,
  digits = 0
): string {
  try {
    return new Intl.NumberFormat(
      "en-AU",
      {
        style: "currency",
        currency,
        maximumFractionDigits:
          digits,
      }
    ).format(value);
  } catch {
    return `${currency} ${value.toFixed(
      digits
    )}`;
  }
}

function percent(
  value: number | null,
  positivePrefix = false
): string {
  if (value === null) {
    return "—";
  }

  return `${positivePrefix && value > 0 ? "+" : ""}${value.toFixed(
    2
  )}%`;
}

function healthLevel(
  score: number
): PositionIntelligenceHealthLevel {
  if (score >= 85) {
    return "STRONG";
  }

  if (score >= 70) {
    return "HEALTHY";
  }

  if (score >= 50) {
    return "WATCH";
  }

  return "HIGH_RISK";
}

function concentrationLevel(
  weight: number
): PositionIntelligenceHealthLevel {
  if (weight <= 10) {
    return "STRONG";
  }

  if (weight <= 20) {
    return "HEALTHY";
  }

  if (weight <= 30) {
    return "WATCH";
  }

  return "HIGH_RISK";
}

function metricTone(
  value: number
): PositionIntelligenceMetric["tone"] {
  if (value > 0) {
    return "POSITIVE";
  }

  if (value < 0) {
    return "NEGATIVE";
  }

  return "NEUTRAL";
}

export function createPositionIntelligence({
  position,
  snapshot,
}: CreatePositionIntelligenceInput): PositionIntelligenceSummary {
  const source =
    record(
      position.original
    );

  const currentPrice =
    numberValue(
      source,
      [
        "livePrice",
        "currentPrice",
        "marketPrice",
        "price",
        "lastPrice",
        "close",
      ]
    ) ??
    (
      position.quantity > 0
        ? position.marketValue /
          position.quantity
        : null
    );

  const averageCost =
    numberValue(
      source,
      [
        "averageCost",
        "averagePrice",
        "averageBuyPrice",
        "avgCost",
        "unitCost",
      ]
    ) ??
    (
      position.quantity > 0
        ? position.costBasis /
          position.quantity
        : null
    );

  const realisedGainLoss =
    numberValue(
      source,
      [
        "realisedGainLoss",
        "realizedGainLoss",
        "realisedPnl",
        "realizedPnl",
      ]
    ) || 0;

  const unrealisedGainLoss =
    position.gainLoss;

  const totalReturn =
    realisedGainLoss +
    unrealisedGainLoss;

  const totalInvested =
    position.costBasis;

  const totalReturnPercent =
    safePercent(
      totalReturn,
      totalInvested
    );

  const yieldOnCost =
    safePercent(
      position.annualIncome,
      position.costBasis
    );

  const incomeContribution =
    safePercent(
      position.annualIncome,
      snapshot.totals.annualIncome
    ) || 0;

  const quoteScore =
    position.quoteQuality ??
    (
      position.quoteStatus ===
      "ESTIMATED"
        ? 40
        : 85
    );

  const concentrationScore =
    clamp(
      100 -
      Math.max(
        0,
        position.portfolioWeight -
        10
      ) *
      3
    );

  const returnScore =
    clamp(
      60 +
      (
        position.gainLossPercent ||
        0
      )
    );

  const incomeScore =
    position.annualIncome > 0
      ? clamp(
          60 +
          (
            position.dividendYield ||
            0
          ) *
          5
        )
      : 50;

  const dataScore =
    clamp(
      quoteScore
    );

  const healthScore =
    clamp(
      concentrationScore *
        0.35 +
      returnScore *
        0.25 +
      incomeScore *
        0.15 +
      dataScore *
        0.25
    );

  const metrics:
    PositionIntelligenceMetric[] = [
      {
        key:
          "MARKET_VALUE",

        label:
          "Market value",

        value:
          money(
            position.marketValue,
            position.currency
          ),

        detail:
          `${position.portfolioWeight.toFixed(
            2
          )}% portfolio weight`,

        tone:
          "INFORMATION",
      },
      {
        key:
          "COST_BASIS",

        label:
          "Cost basis",

        value:
          money(
            position.costBasis,
            position.currency
          ),

        detail:
          averageCost === null
            ? "Average cost unavailable"
            : `${money(
                averageCost,
                position.currency,
                4
              )} average cost`,

        tone:
          "NEUTRAL",
      },
      {
        key:
          "UNREALISED_RETURN",

        label:
          "Unrealised return",

        value:
          money(
            unrealisedGainLoss,
            position.currency
          ),

        detail:
          percent(
            position.gainLossPercent,
            true
          ),

        tone:
          metricTone(
            unrealisedGainLoss
          ),
      },
      {
        key:
          "TOTAL_RETURN",

        label:
          "Total return",

        value:
          money(
            totalReturn,
            position.currency
          ),

        detail:
          percent(
            totalReturnPercent,
            true
          ),

        tone:
          metricTone(
            totalReturn
          ),
      },
      {
        key:
          "DAILY_CHANGE",

        label:
          "Today",

        value:
          money(
            position.dailyChange,
            position.currency
          ),

        detail:
          percent(
            position.dailyChangePercent,
            true
          ),

        tone:
          metricTone(
            position.dailyChange
          ),
      },
      {
        key:
          "ANNUAL_INCOME",

        label:
          "Annual income",

        value:
          money(
            position.annualIncome,
            position.currency
          ),

        detail:
          `${percent(
            position.dividendYield
          )} forward yield`,

        tone:
          position.annualIncome > 0
            ? "POSITIVE"
            : "NEUTRAL",
      },
      {
        key:
          "YIELD_ON_COST",

        label:
          "Yield on cost",

        value:
          percent(
            yieldOnCost
          ),

        detail:
          `${percent(
            incomeContribution
          )} of portfolio income`,

        tone:
          yieldOnCost !== null &&
          yieldOnCost > 0
            ? "POSITIVE"
            : "NEUTRAL",
      },
      {
        key:
          "QUOTE_QUALITY",

        label:
          "Quote quality",

        value:
          `${quoteScore.toFixed(
            0
          )}/100`,

        detail:
          position.quoteStatus,

        tone:
          quoteScore >= 75
            ? "POSITIVE"
            : quoteScore >= 50
              ? "INFORMATION"
              : "NEGATIVE",
      },
    ];

  const healthIndicators:
    PositionHealthIndicator[] = [
      {
        key:
          "CONCENTRATION",

        label:
          "Position size",

        score:
          concentrationScore,

        value:
          `${position.portfolioWeight.toFixed(
            2
          )}%`,

        description:
          position.portfolioWeight <= 10
            ? "Position size is comfortably diversified."
            : position.portfolioWeight <= 20
              ? "Position size is meaningful but currently manageable."
              : "Position size creates elevated portfolio concentration.",

        level:
          concentrationLevel(
            position.portfolioWeight
          ),
      },
      {
        key:
          "PERFORMANCE",

        label:
          "Performance",

        score:
          returnScore,

        value:
          percent(
            position.gainLossPercent,
            true
          ),

        description:
          position.gainLoss > 0
            ? "The position is currently trading above its recorded cost basis."
            : position.gainLoss < 0
              ? "The position is currently trading below its recorded cost basis."
              : "The position is currently near its recorded cost basis.",

        level:
          healthLevel(
            returnScore
          ),
      },
      {
        key:
          "INCOME",

        label:
          "Income quality",

        score:
          incomeScore,

        value:
          money(
            position.annualIncome,
            position.currency
          ),

        description:
          position.annualIncome > 0
            ? "The position contributes recurring projected portfolio income."
            : "No forward dividend income is currently recorded for this position.",

        level:
          healthLevel(
            incomeScore
          ),
      },
      {
        key:
          "DATA",

        label:
          "Market data",

        score:
          dataScore,

        value:
          position.quoteStatus,

        description:
          dataScore >= 75
            ? "Market pricing is currently suitable for portfolio calculations."
            : "Pricing quality should be reviewed before relying on the valuation.",

        level:
          healthLevel(
            dataScore
          ),
      },
    ];

  const rank =
    snapshot.positions.findIndex(
      item =>
        item.symbol ===
        position.symbol
    ) +
    1;

  const generatedSummary = [
    position.gainLoss > 0
      ? `${position.symbol} is currently above its recorded cost basis by ${percent(
          position.gainLossPercent,
          true
        )}.`
      : position.gainLoss < 0
        ? `${position.symbol} is currently below its recorded cost basis by ${percent(
            position.gainLossPercent,
            true
          )}.`
        : `${position.symbol} is currently near its recorded cost basis.`,

    position.portfolioWeight > 20
      ? `The position represents ${position.portfolioWeight.toFixed(
          2
        )}% of the portfolio and creates elevated concentration.`
      : `The position represents ${position.portfolioWeight.toFixed(
          2
        )}% of the portfolio.`,

    position.annualIncome > 0
      ? `Projected annual income is ${money(
          position.annualIncome,
          position.currency
        )}, contributing ${percent(
          incomeContribution
        )} of portfolio income.`
      : "No forward dividend income is currently recorded.",

    `Market-data status is ${position.quoteStatus.toLowerCase()} with an estimated quality score of ${quoteScore.toFixed(
      0
    )}/100.`,
  ];

  return {
    position,

    rank:
      rank > 0
        ? rank
        : snapshot.positions.length,

    holdingCount:
      snapshot.positions.length,

    currentPrice,
    averageCost,

    realisedGainLoss,
    unrealisedGainLoss,

    totalReturn,
    totalReturnPercent,

    yieldOnCost,
    incomeContribution,

    concentrationLevel:
      concentrationLevel(
        position.portfolioWeight
      ),

    healthScore,
    healthLevel:
      healthLevel(
        healthScore
      ),

    metrics,
    healthIndicators,

    generatedSummary,

    original:
      position.original,
  };
}
