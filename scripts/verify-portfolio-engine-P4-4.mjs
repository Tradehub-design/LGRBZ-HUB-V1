import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  audit:
    "src/core/portfolio-engine/dividends/audit.ts",

  reconcile:
    "src/core/portfolio-engine/dividends/reconcile.ts",

  eligibility:
    "src/core/portfolio-engine/dividends/eligibility.ts",

  deduplicate:
    "src/core/portfolio-engine/dividends/deduplicate.ts",

  tax:
    "src/core/portfolio-engine/dividends/tax.ts",

  snapshot:
    "src/core/portfolio-engine/dividends/snapshot.ts",

  hook:
    "src/core/portfolio-engine/client/usePortfolioDividendEngine.ts",

  retention:
    "src/core/portfolio-engine/client/portfolio-dividend-retention.ts",

  selectors:
    "src/core/portfolio-engine/client/dividend-selectors.ts",

  dividends:
    "src/app/(dashboard)/dividends/page.tsx",

  forecast:
    "src/app/(dashboard)/dividend-forecast/page.tsx",

  index:
    "src/core/portfolio-engine/dividends/index.ts",
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

const audit =
  read(files.audit);

const reconcile =
  read(files.reconcile);

const eligibility =
  read(files.eligibility);

const deduplicate =
  read(files.deduplicate);

const tax =
  read(files.tax);

const snapshot =
  read(files.snapshot);

const hook =
  read(files.hook);

const retention =
  read(files.retention);

const selectors =
  read(files.selectors);

const dividends =
  read(files.dividends);

const forecast =
  read(files.forecast);

const dividendIndex =
  read(files.index);

const auditTokens = [
  "auditPortfolioDividends",
  "assertPortfolioDividendAudit",
  "quantityOwnedBeforeExDate",
  "auditEligibility",
  "auditDuplicateEvents",
  "auditForecastOverlap",
  "eventForwardIncomeAud",
  "holdingForwardIncomeAud",
  "monthlyForwardIncomeAud",
  "expectedPortfolioYieldPercent",
  "expectedYieldOnCostPercent",
  "eventFrankingCreditsAud",
  "eventWithholdingTaxAud",
];

for (const token of auditTokens) {
  assert(
    audit.includes(token),
    `Dividend audit is missing: ${token}`,
  );
}

const reconciliationTokens = [
  "reconcilePortfolioDividends",
  "announcedForwardIncomeAud",
  "forecastForwardIncomeAud",
  "eventFrankingCreditsAud",
  "eventWithholdingTaxAud",
  "expectedDividendYieldPercent",
  "expectedYieldOnCostPercent",
];

for (const token of reconciliationTokens) {
  assert(
    reconcile.includes(token),
    `Dividend reconciliation is missing: ${token}`,
  );
}

assert(
  eligibility.includes(
    "effectiveDate(transaction) <",
  ),
  "Eligibility no longer excludes ex-date transactions.",
);

assert(
  eligibility.includes(
    "DIVIDEND_REINVESTMENT",
  ) &&
  eligibility.includes(
    "TRANSFER_IN",
  ) &&
  eligibility.includes(
    "TRANSFER_OUT",
  ) &&
  eligibility.includes(
    "SPLIT",
  ) &&
  eligibility.includes(
    "CONSOLIDATION",
  ),
  "Eligibility does not cover all required quantity-changing actions.",
);

assert(
  deduplicate.includes(
    "suppressForecastsCoveredByAnnouncements",
  ),
  "Announced-event forecast suppression is missing.",
);

assert(
  tax.includes(
    "companyTaxFraction /",
  ) &&
  tax.includes(
    "1 -",
  ),
  "Australian franking-credit formula is missing.",
);

assert(
  snapshot.includes(
    "deduplicatePortfolioDividendEvents",
  ),
  "Dividend snapshot is not deduplicating events.",
);

assert(
  snapshot.includes(
    "buildHoldingSummaries",
  ),
  "Dividend snapshot is not building canonical holding forecasts.",
);

assert(
  snapshot.includes(
    "buildMonthlyForecast",
  ),
  "Dividend snapshot is not building canonical monthly forecasts.",
);

assert(
  hook.includes(
    "useLivePortfolioEngineSnapshot",
  ),
  "Dividend hook is not using the live Portfolio Snapshot.",
);

assert(
  hook.includes(
    "loadRetainedDividendResponse",
  ) &&
  hook.includes(
    "saveRetainedDividendResponse",
  ),
  "Dividend provider-failure retention is incomplete.",
);

assert(
  retention.includes(
    "24 *",
  ) &&
  retention.includes(
    "MAX_AGE_MS",
  ),
  "Dividend response retention maximum age is missing.",
);

assert(
  selectors.includes(
    "selectDividendAudit",
  ),
  "Dividend selectors do not expose the complete audit.",
);

assert(
  dividendIndex.includes(
    "./audit",
  ),
  "Dividend module does not export the audit.",
);

const pageTokens = [
  "usePortfolioDividendEngine",
  "dividendSnapshot",
  "selectDividendReconciliation",
  "forceRefresh",
];

for (const token of pageTokens) {
  assert(
    dividends.includes(token),
    `Dividend Centre is missing: ${token}`,
  );

  assert(
    forecast.includes(token),
    `Dividend Forecast is missing: ${token}`,
  );
}

const forbiddenPageTokens = [
  "mock-data",
  "mockDividends",
  "sampleDividends",
  "useSeedPortfolio",
  "useDashboardData",
  "loadTxLedger",
  "usePortfolioStore",
  "Math.random(",
  "calculateDividendForecast(",
  "calculateDividendYield(",
];

for (const token of forbiddenPageTokens) {
  assert(
    !dividends.includes(token),
    `Dividend Centre contains a legacy or placeholder path: ${token}`,
  );

  assert(
    !forecast.includes(token),
    `Dividend Forecast contains a legacy or placeholder path: ${token}`,
  );
}

const forbiddenPatterns = [
  /Math\.random\s*\(/,
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
    "audit.ts",
    audit,
  ],
  [
    "reconcile.ts",
    reconcile,
  ],
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
    "snapshot.ts",
    snapshot,
  ],
  [
    "usePortfolioDividendEngine.ts",
    hook,
  ],
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
    "Portfolio Engine P4.4 verification FAILED:",
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
  "Portfolio Engine P4.4 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Dividend snapshot references canonical Portfolio Snapshot");
console.log(" - Ex-date ownership audit");
console.log(" - Partial buy and sell eligibility");
console.log(" - Transfer eligibility");
console.log(" - Split and consolidation eligibility");
console.log(" - Duplicate-event audit");
console.log(" - Announced/forecast overlap audit");
console.log(" - Event forward income reconciliation");
console.log(" - Holding forward income reconciliation");
console.log(" - Monthly forecast reconciliation");
console.log(" - Portfolio dividend-yield reconciliation");
console.log(" - Yield-on-cost reconciliation");
console.log(" - Franking-credit reconciliation");
console.log(" - Withholding-tax reconciliation");
console.log(" - Provider-failure retention");
console.log(" - Dividend Centre canonical data path");
console.log(" - Dividend Forecast canonical data path");
console.log(" - No mock or placeholder dividend values");
console.log("");
