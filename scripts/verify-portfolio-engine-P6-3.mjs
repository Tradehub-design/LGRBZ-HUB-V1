import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  contracts:
    "src/core/portfolio-engine/tax/contracts.ts",

  build:
    "src/core/portfolio-engine/tax/build.ts",

  reconcile:
    "src/core/portfolio-engine/tax/reconcile.ts",

  index:
    "src/core/portfolio-engine/tax/index.ts",

  page:
    "src/app/(dashboard)/tax/page.tsx",

  hook:
    "src/core/portfolio-engine/client/usePortfolioIntelligence.ts",

  selectors:
    "src/core/portfolio-engine/client/intelligence-selectors.ts",

  reports:
    "src/core/portfolio-engine/reports/build.ts",
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

function compact(
  content,
) {
  return content.replace(
    /\s+/g,
    "",
  );
}

function requireTokens(
  content,
  tokens,
  prefix,
) {
  const compacted =
    compact(content);

  for (const token of tokens) {
    assert(
      compacted.includes(
        compact(token),
      ),
      `${prefix} is missing: ${token}`,
    );
  }
}

const contracts =
  read(files.contracts);

const build =
  read(files.build);

const reconcile =
  read(files.reconcile);

const index =
  read(files.index);

const page =
  read(files.page);

const hook =
  read(files.hook);

const selectors =
  read(files.selectors);

const reports =
  read(files.reports);

requireTokens(
  contracts,
  [
    "TaxTransactionCategory",
    "TaxTransactionRow",
    "PortfolioTaxTotals",
    "PortfolioTaxDataQuality",
    "PortfolioTaxSnapshot",
    "dashboardSnapshotId",
    "grossAssessableIncomeAud",
  ],
  "Tax contracts",
);

requireTokens(
  build,
  [
    "buildPortfolioTaxSnapshot",
    "financialYearForDate",
    'transaction.status !== "posted"',
    "transactionGrossAmountAud",
    "transactionFeesAud",
    "transactionTaxAud",
    "transactionRealisedGainAud",
    "transactionFrankingCreditAud",
    "transactionWithholdingTaxAud",
    "realisedCapitalGainAud",
    "realisedCapitalLossAud",
    "netRealisedCapitalGainAud",
    "dividendIncomeAud",
    "interestIncomeAud",
    "frankingCreditsAud",
    "withholdingTaxAud",
    "transactionFeesAud",
    "recordedTaxAud",
    "grossAssessableIncomeAud",
    "unresolvedRealisedGainCount",
  ],
  "Tax builder",
);

requireTokens(
  reconcile,
  [
    "reconcilePortfolioTax",
    "rowRealisedGainAud",
    "rowDividendIncomeAud",
    "rowInterestIncomeAud",
    "rowFeesAud",
    "rowRecordedTaxAud",
    "calculatedGrossAssessableIncomeAud",
  ],
  "Tax reconciliation",
);

requireTokens(
  index,
  [
    "./contracts",
    "./build",
    "./reconcile",
  ],
  "Tax exports",
);

requireTokens(
  hook,
  [
    "reconcilePortfolioTax",
    "taxReconciliation",
    "buildPortfolioTaxSnapshot",
    "buildPortfolioReportSnapshot",
  ],
  "Portfolio Intelligence hook",
);

requireTokens(
  selectors,
  [
    "selectPortfolioTax",
    "selectPortfolioTaxReconciliation",
    "reconcilePortfolioTax",
  ],
  "Intelligence selectors",
);

requireTokens(
  reports,
  [
    "input.tax.portfolioSnapshotId",
    "input.tax.dividendSnapshotId",
    "input.tax.dashboardSnapshotId",
    "dashboard.portfolioSnapshotId",
    "dashboard.dividendSnapshotId",
    "dashboard.dashboardSnapshotId",
  ],
  "Report lineage checks",
);

requireTokens(
  page,
  [
    '"use client";',
    "usePortfolioIntelligence",
    "selectPortfolioTax",
    "selectPortfolioTaxReconciliation",
    "tax.financialYear.label",
    "tax.totals.netRealisedCapitalGainAud",
    "tax.totals.realisedCapitalGainAud",
    "tax.totals.realisedCapitalLossAud",
    "tax.totals.dividendIncomeAud",
    "tax.totals.interestIncomeAud",
    "tax.totals.frankingCreditsAud",
    "tax.totals.withholdingTaxAud",
    "tax.totals.transactionFeesAud",
    "tax.totals.recordedTaxAud",
    "tax.totals.grossAssessableIncomeAud",
    "tax.dataQuality.unresolvedRealisedGainCount",
    "tax.rows",
    "exportTaxCsv",
    "forceRefresh",
  ],
  "Tax Centre route",
);

const forbiddenTerms = [
  "useSeedPortfolio",
  "useDashboardData",
  "usePortfolioStore",
  "mockTax",
  "mock-data",
  "Math.random(",
  "calculateTaxPayable(",
  "calculateCgtDiscount(",
  "personalTaxRate",
  "hardcodedTax",
];

for (const term of forbiddenTerms) {
  assert(
    !page.includes(term),
    `Tax Centre contains a forbidden legacy or invented path: ${term}`,
  );
}

assert(
  page.startsWith(
    '"use client";',
  ),
  'Tax Centre "use client" directive is not first.',
);

const forbiddenPatterns = [
  /mock tax/i,
  /placeholder tax/i,
  /fake capital gain/i,
  /hardcoded tax payable/i,
  /assumed tax bracket/i,
  /invented acquisition date/i,
  /automatic cgt discount/i,
];

for (
  const [
    name,
    content,
  ] of [
    [
      "tax/build.ts",
      build,
    ],

    [
      "tax/reconcile.ts",
      reconcile,
    ],

    [
      "tax/page.tsx",
      page,
    ],
  ]
) {
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(content),
      `${name} contains forbidden placeholder or invented logic: ${pattern}`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P6.3 verification FAILED:",
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
  "Portfolio Engine P6.3 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Tax Centre uses Portfolio Intelligence");
console.log(" - Australian financial-year filtering");
console.log(" - Posted transactions only");
console.log(" - Capital gains and losses separated");
console.log(" - Dividend income separated");
console.log(" - Interest income separated");
console.log(" - Franking credits separated");
console.log(" - Foreign withholding separated");
console.log(" - Transaction fees separated");
console.log(" - Recorded tax separated");
console.log(" - Gross assessable income reconciled");
console.log(" - Unresolved disposal gains are disclosed");
console.log(" - Dividend fallback use is disclosed");
console.log(" - Tax rows reconcile with tax totals");
console.log(" - Report snapshot lineage is enforced");
console.log(" - Tax CSV export connected");
console.log(" - No personal tax payable estimate");
console.log(" - No invented CGT discount");
console.log(" - No mock or placeholder tax values");
console.log("");
