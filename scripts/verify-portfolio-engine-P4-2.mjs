import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  eligibility:
    "src/core/portfolio-engine/dividends/eligibility.ts",

  deduplicate:
    "src/core/portfolio-engine/dividends/deduplicate.ts",

  tax:
    "src/core/portfolio-engine/dividends/tax.ts",

  normalise:
    "src/core/portfolio-engine/dividends/normalise.ts",

  snapshot:
    "src/core/portfolio-engine/dividends/snapshot.ts",

  reconcile:
    "src/core/portfolio-engine/dividends/reconcile.ts",

  dividendIndex:
    "src/core/portfolio-engine/dividends/index.ts",

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

const eligibility =
  read(files.eligibility);

const deduplicate =
  read(files.deduplicate);

const tax =
  read(files.tax);

const normalise =
  read(files.normalise);

const snapshot =
  read(files.snapshot);

const reconcile =
  read(files.reconcile);

const dividendIndex =
  read(files.dividendIndex);

const selectors =
  read(files.selectors);

const eligibilityTokens = [
  "quantityOwnedBeforeExDate",
  "transaction.status === \"posted\"",
  "effectiveDate(transaction) <",
  "DIVIDEND_REINVESTMENT",
  "TRANSFER_IN",
  "TRANSFER_OUT",
  "SPLIT",
  "CONSOLIDATION",
  "eligibleQuantity",
];

for (const token of eligibilityTokens) {
  assert(
    eligibility.includes(token),
    `Dividend eligibility is missing: ${token}`,
  );
}

const deduplicateTokens = [
  "deduplicatePortfolioDividendEvents",
  "eventIdentity",
  "selectStrongerEvent",
  "suppressForecastsCoveredByAnnouncements",
  "isReceived",
  "isAnnounced",
  "isForecast",
];

for (const token of deduplicateTokens) {
  assert(
    deduplicate.includes(token),
    `Dividend deduplication is missing: ${token}`,
  );
}

const taxTokens = [
  "calculateDividendTax",
  "frankedCashAud",
  "unfrankedCashAud",
  "frankingCreditAud",
  "grossedUpIncomeAud",
  "withholdingTaxAud",
  "estimatedNetTaxPayableAud",
  "companyTaxFraction",
];

for (const token of taxTokens) {
  assert(
    tax.includes(token),
    `Dividend tax logic is missing: ${token}`,
  );
}

const normaliseTokens = [
  "quantityOwnedBeforeExDate",
  "resolveEligibleQuantity",
  "calculateDividendTax",
  "expectedCashAud",
  "frankingPercentage",
  "frankingCreditAud",
  "grossedUpIncomeAud",
  "withholdingTaxAud",
  "estimatedTaxAud",
];

for (const token of normaliseTokens) {
  assert(
    normalise.includes(token),
    `Dividend normalisation is missing: ${token}`,
  );
}

const snapshotTokens = [
  "deduplicatePortfolioDividendEvents",
  "buildMonthlyForecast",
  "buildHoldingSummaries",
  "buildTotals",
  "announcedForwardIncomeAud",
  "forecastForwardIncomeAud",
  "forwardTwelveMonthIncomeAud",
  "projectedFrankingCreditsAud",
  "estimatedWithholdingTaxAud",
  "portfolioDividendYieldPercent",
  "portfolioYieldOnCostPercent",
];

for (const token of snapshotTokens) {
  assert(
    snapshot.includes(token),
    `Dividend snapshot is missing: ${token}`,
  );
}

const reconcileTokens = [
  "reconcilePortfolioDividends",
  "assertPortfolioDividendsReconcile",
  "eventForwardIncomeAud",
  "holdingForwardIncomeAud",
  "monthlyForwardIncomeAud",
  "eventFrankingCreditsAud",
  "Duplicate dividend event remains",
];

for (const token of reconcileTokens) {
  assert(
    reconcile.includes(token),
    `Dividend reconciliation is missing: ${token}`,
  );
}

assert(
  dividendIndex.includes(
    "./eligibility",
  ) &&
  dividendIndex.includes(
    "./deduplicate",
  ) &&
  dividendIndex.includes(
    "./tax",
  ) &&
  dividendIndex.includes(
    "./reconcile",
  ),
  "Dividend module exports are incomplete.",
);

assert(
  selectors.includes(
    "selectDividendReconciliation",
  ),
  "Dividend selectors do not expose reconciliation.",
);

assert(
  selectors.includes(
    "selectEstimatedWithholdingTaxAud",
  ),
  "Dividend selectors do not expose withholding tax.",
);

assert(
  eligibility.includes(
    "effectiveDate(transaction) <\n            exTimestamp",
  ),
  "Transactions on the ex-date may still be incorrectly included.",
);

assert(
  snapshot.includes(
    "announcedForwardIncomeAud +\n      forecastForwardIncomeAud",
  ),
  "Forward income is not explicitly separated into announced and forecast totals.",
);

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock dividend/i,
  /sample dividend/i,
  /placeholder dividend/i,
  /fake income/i,
  /hardcoded dividend income/i,
];

for (const [
  name,
  content,
] of [
  [
    "eligibility.ts",
    eligibility,
  ],
  [
    "deduplicate.ts",
    deduplicate,
  ],
  [
    "tax.ts",
    tax,
  ],
  [
    "normalise.ts",
    normalise,
  ],
  [
    "snapshot.ts",
    snapshot,
  ],
  [
    "reconcile.ts",
    reconcile,
  ],
]) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `${name} contains forbidden mock or non-deterministic logic: ${pattern}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P4.2 verification FAILED:",
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
  "Portfolio Engine P4.2 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Dividend eligibility rebuilt from transactions");
console.log(" - Quantity is measured before the ex-dividend date");
console.log(" - Ex-date purchases are excluded");
console.log(" - Partial buys and sells affect eligibility");
console.log(" - Transfers affect eligibility");
console.log(" - Splits and consolidations affect eligibility");
console.log(" - Provider events are deduplicated");
console.log(" - Received events outrank forecast events");
console.log(" - Announced events suppress duplicate forecasts");
console.log(" - Australian franking-credit formula added");
console.log(" - Grossed-up dividend income added");
console.log(" - Foreign withholding tax added");
console.log(" - Event-derived monthly forecast added");
console.log(" - Holding-derived forward income added");
console.log(" - Portfolio dividend reconciliation added");
console.log(" - No mock dividend values");
console.log("");
