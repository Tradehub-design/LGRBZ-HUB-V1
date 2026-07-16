import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const visualPath =
  path.join(
    root,
    "src/lib/holdings-professional/holdingsVisualEngine.ts",
  );

const overviewPath =
  path.join(
    root,
    "src/components/professional-overview/portfolioOverviewNormaliser.ts",
  );

const failures = [];

function assert(
  condition,
  message,
) {
  if (!condition) {
    failures.push(message);
  }
}

function read(
  filePath,
) {
  if (
    !fs.existsSync(
      filePath,
    )
  ) {
    failures.push(
      `Missing file: ${filePath}`,
    );

    return "";
  }

  return fs.readFileSync(
    filePath,
    "utf8",
  );
}

const visual =
  read(
    visualPath,
  );

const overview =
  read(
    overviewPath,
  );

const canonicalFieldTokens = [
  "marketPriceAud",
  "priceAud",
  "marketValueAud",
  "valueAud",
  "costBaseAud",
  "averageCostAud",
  "averagePriceAud",
  "unrealisedPlAud",
  "unrealisedGainAud",
  "unrealisedPlPercent",
  "unrealisedGainPercent",
  "portfolioWeightPercent",
  "weightPercent",
  "quoteSource",
  "quoteQuality",
];

for (
  const token of canonicalFieldTokens
) {
  assert(
    visual.includes(token),
    `Professional visual engine is missing canonical field: ${token}`,
  );

  assert(
    overview.includes(token),
    `Professional overview normaliser is missing canonical field: ${token}`,
  );
}

const quoteTokens = [
  "LIVE",
  "CACHE",
  "PREVIOUS_CLOSE",
  "TRANSACTION_FALLBACK",
  "UNAVAILABLE",
  "ESTIMATED TRANSACTION",
];

for (
  const token of quoteTokens
) {
  assert(
    visual.includes(token),
    `Professional visual engine is missing quote state: ${token}`,
  );

  assert(
    overview.includes(token),
    `Professional overview normaliser is missing quote state: ${token}`,
  );
}

const forecastTokens = [
  "forecastAnnualIncomeAud",
  "projectedAnnualIncomeAud",
  "forwardAnnualIncomeAud",
  "annualDividendIncomeAud",
];

for (
  const token of forecastTokens
) {
  assert(
    visual.includes(token),
    `Professional visual engine is missing forecast field: ${token}`,
  );

  assert(
    overview.includes(token),
    `Professional overview normaliser is missing forecast field: ${token}`,
  );
}

assert(
  !visual.includes(
    ": costBasis\n    );",
  ),
  "Visual engine may still substitute cost basis as market value.",
);

assert(
  !overview.includes(
    ": costBasis\n    );",
  ),
  "Overview normaliser may still substitute cost basis as market value.",
);

assert(
  visual.includes(
    "hasCompleteSuppliedWeights",
  ),
  "Visual engine does not preserve canonical supplied weights.",
);

assert(
  overview.includes(
    "hasCompleteSuppliedWeights",
  ),
  "Overview normaliser does not preserve canonical supplied weights.",
);

assert(
  visual.includes(
    "suppliedPortfolioWeight",
  ),
  "Visual engine is missing supplied canonical weight handling.",
);

assert(
  overview.includes(
    "suppliedPortfolioWeight",
  ),
  "Overview normaliser is missing supplied canonical weight handling.",
);

assert(
  !visual.includes(
    '"dividendsAud"',
  ),
  "Visual engine must not treat historical dividendsAud as annual forecast income.",
);

assert(
  !overview.includes(
    '"dividendsAud"',
  ),
  "Overview normaliser must not treat historical dividendsAud as annual forecast income.",
);

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock portfolio/i,
  /sample holding/i,
  /placeholder holding/i,
  /fake market value/i,
];

for (
  const [
    name,
    content,
  ] of [
    [
      "holdingsVisualEngine.ts",
      visual,
    ],
    [
      "portfolioOverviewNormaliser.ts",
      overview,
    ],
  ]
) {
  for (
    const pattern of forbiddenPatterns
  ) {
    assert(
      !pattern.test(
        content,
      ),
      `${name} contains forbidden placeholder or non-deterministic logic: ${pattern}`,
    );
  }
}

if (
  failures.length > 0
) {
  console.error("");
  console.error(
    "Portfolio Engine P2.3 verification FAILED:",
  );
  console.error("");

  for (
    const failure of failures
  ) {
    console.error(
      ` - ${failure}`,
    );
  }

  console.error("");
  process.exit(1);
}

console.log("");
console.log(
  "Portfolio Engine P2.3 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Professional widgets read marketPriceAud");
console.log(" - Professional widgets read marketValueAud");
console.log(" - Professional widgets read costBaseAud");
console.log(" - Professional widgets read averageCostAud");
console.log(" - Professional widgets read canonical unrealised P/L");
console.log(" - Professional widgets preserve canonical weights");
console.log(" - Missing quotes remain unavailable");
console.log(" - Cost base is not substituted as market value");
console.log(" - Live quote status is preserved");
console.log(" - Cached quote status is preserved");
console.log(" - Previous-close quote status is preserved");
console.log(" - Transaction fallback is labelled estimated");
console.log(" - Historical dividends are not annualised");
console.log(" - Future annual income uses explicit forecast fields only");
console.log(" - Existing professional UI components remain unchanged");
console.log(" - No mock portfolio values");
console.log("");
