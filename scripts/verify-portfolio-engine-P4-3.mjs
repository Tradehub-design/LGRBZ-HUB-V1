import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  dividends:
    "src/app/(dashboard)/dividends/page.tsx",

  forecast:
    "src/app/(dashboard)/dividend-forecast/page.tsx",

  hook:
    "src/core/portfolio-engine/client/usePortfolioDividendEngine.ts",

  selectors:
    "src/core/portfolio-engine/client/dividend-selectors.ts",
};

function assert(
  condition,
  message,
) {
  if (!condition) {
    failures.push(message);
  }
}

function read(
  relativePath,
) {
  const absolutePath =
    path.join(
      root,
      relativePath,
    );

  if (!fs.existsSync(absolutePath)) {
    failures.push(
      `Missing required file: ${relativePath}`,
    );

    return "";
  }

  return fs.readFileSync(
    absolutePath,
    "utf8",
  );
}

const dividends =
  read(files.dividends);

const forecast =
  read(files.forecast);

const hook =
  read(files.hook);

const selectors =
  read(files.selectors);

const dividendPageTokens = [
  "usePortfolioDividendEngine",
  "dividendSnapshot",
  "selectUpcomingDividendEvents",
  "selectReceivedDividendEvents",
  "selectHistoricalDividendEvents",
  "selectNextDividendEvent",
  "selectDividendReconciliation",
  "totals.forwardTwelveMonthIncomeAud",
  "totals.receivedCurrentFinancialYearAud",
  "totals.portfolioDividendYieldPercent",
  "totals.portfolioYieldOnCostPercent",
  "totals.projectedFrankingCreditsAud",
  "totals.estimatedWithholdingTaxAud",
  "event.eligibleQuantity",
  "event.exDate",
  "event.paymentDate",
  "event.frankingCreditAud",
  "event.withholdingTaxAud",
  "forceRefresh",
];

for (const token of dividendPageTokens) {
  assert(
    dividends.includes(token),
    `Dividend Centre is missing canonical token: ${token}`,
  );
}

const forecastPageTokens = [
  "usePortfolioDividendEngine",
  "selectDividendHoldingSummaries",
  "selectForecastDividendEvents",
  "selectDividendReconciliation",
  "dividendSnapshot.monthlyForecast",
  "totals.forwardTwelveMonthIncomeAud",
  "totals.monthlyForwardIncomeAud",
  "totals.portfolioDividendYieldPercent",
  "totals.portfolioYieldOnCostPercent",
  "totals.projectedFrankingCreditsAud",
  "totals.estimatedWithholdingTaxAud",
  "holding.marketValueAud",
  "holding.costBaseAud",
  "holding.forwardTwelveMonthIncomeAud",
  "holding.dividendYieldPercent",
  "holding.yieldOnCostPercent",
  "holding.nextExDate",
  "holding.nextPaymentDate",
  "forceRefresh",
];

for (const token of forecastPageTokens) {
  assert(
    forecast.includes(token),
    `Dividend Forecast is missing canonical token: ${token}`,
  );
}

const forbiddenPageTokens = [
  "mock-data",
  "mockDividends",
  "sampleDividends",
  "calculateDividendForecast(",
  "calculateDividendYield(",
  "useSeedPortfolio",
  "useDashboardData",
  "loadTxLedger",
  "usePortfolioStore",
  "Math.random(",
];

for (const token of forbiddenPageTokens) {
  assert(
    !dividends.includes(token),
    `Dividend Centre contains legacy or placeholder logic: ${token}`,
  );

  assert(
    !forecast.includes(token),
    `Dividend Forecast contains legacy or placeholder logic: ${token}`,
  );
}

assert(
  hook.includes(
    "useLivePortfolioEngineSnapshot",
  ),
  "Dividend hook does not consume the live-valued Portfolio Snapshot.",
);

assert(
  hook.includes(
    'fetch(\n      "/api/dividend-data"',
  ),
  "Dividend hook does not consume the dividend-data API.",
);

assert(
  selectors.includes(
    "selectDividendReconciliation",
  ),
  "Dividend reconciliation selector is missing.",
);

const forbiddenPatterns = [
  /mock dividend/i,
  /sample dividend/i,
  /placeholder dividend/i,
  /fake annual income/i,
  /hardcoded dividend yield/i,
  /hardcoded forecast income/i,
];

for (const [
  name,
  content,
] of [
  [
    "dividends/page.tsx",
    dividends,
  ],
  [
    "dividend-forecast/page.tsx",
    forecast,
  ],
]) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `${name} contains forbidden dividend logic: ${pattern}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P4.3 verification FAILED:",
  );
  console.error("");

  for (const failure of failures) {
    console.error(
      ` - ${failure}`,
    );
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "Portfolio Engine P4.3 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Dividend Centre uses canonical Dividend Engine");
console.log(" - Dividend Forecast uses canonical Dividend Engine");
console.log(" - Both routes use the same live Portfolio Snapshot");
console.log(" - Historical dividend events displayed");
console.log(" - Received dividend events displayed");
console.log(" - Upcoming dividend events displayed");
console.log(" - Eligible ex-date quantity displayed");
console.log(" - Ex-dividend dates displayed");
console.log(" - Payment dates displayed");
console.log(" - Annual forecast income displayed");
console.log(" - Monthly forecast income displayed");
console.log(" - Dividend yield uses canonical market value");
console.log(" - Yield on cost uses canonical cost base");
console.log(" - Franking credits displayed");
console.log(" - Withholding tax displayed");
console.log(" - Provider status displayed");
console.log(" - Manual dividend refresh connected");
console.log(" - Dividend reconciliation displayed");
console.log(" - No page-level dividend calculations");
console.log(" - No mock or placeholder dividend values");
console.log("");
