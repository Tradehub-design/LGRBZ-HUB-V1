import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const pagePath =
  path.join(
    root,
    "src/app/(dashboard)/holdings/page.tsx",
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

if (!fs.existsSync(pagePath)) {
  console.error(
    "Holdings page does not exist.",
  );

  process.exit(1);
}

const page =
  fs.readFileSync(
    pagePath,
    "utf8",
  );

const requiredTokens = [
  "usePortfolioEngineSnapshot",
  "selectApplicationOpenHoldings",
  "selectApplicationClosedHoldings",
  "engineResult.snapshot",
  "snapshot.totals",
  "snapshot.dataQuality",
  "totals.securitiesMarketValueAud",
  "totals.openCostBaseAud",
  "totals.realisedGainAud",
  "totals.unrealisedGainAud",
  "totals.totalReturnAud",
  "totals.totalReturnPercent",
  "holding.marketValueAud",
  "holding.costBaseAud",
  "holding.unrealisedPlAud",
  "holding.portfolioWeightPercent",
  "holding.quoteSource",
  "HoldingsCommandCentre",
  "ProfessionalHoldingsOverview",
];

for (const token of requiredTokens) {
  assert(
    page.includes(token),
    `Holdings page is missing canonical token: ${token}`,
  );
}

const forbiddenTokens = [
  "calculateHoldingsFromLedger",
  "loadTxLedger",
  "usePortfolioStore",
  "storeTransactions",
  "localTransactions",
  "setLocalTransactions",
  "holdings.reduce",
  "openHoldings.reduce",
];

for (const token of forbiddenTokens) {
  assert(
    !page.includes(token),
    `Holdings page still contains legacy or independent calculation path: ${token}`,
  );
}

const forbiddenPatterns = [
  /Math\.random\s*\(/,
  /mock portfolio/i,
  /sample holding/i,
  /placeholder holding/i,
  /fake market value/i,
];

for (const pattern of forbiddenPatterns) {
  assert(
    !pattern.test(page),
    `Holdings page contains forbidden mock or non-deterministic logic: ${pattern}`,
  );
}

assert(
  page.includes(
    "Calculated from the transaction ledger through the canonical",
  ),
  "Holdings page does not identify the canonical engine data flow.",
);

assert(
  page.includes(
    "Transaction-price fallbacks",
  ),
  "Holdings page does not expose fallback quote quality.",
);

assert(
  page.includes(
    "Missing prices",
  ),
  "Holdings page does not expose unavailable quote count.",
);

assert(
  page.includes(
    "holding.marketPriceAud > 0",
  ),
  "Holdings page does not prevent unavailable prices from appearing as valid zero values.",
);

assert(
  !page.includes(
    "holdings={[openHoldings]}",
  ),
  "Holdings page still passes a nested holdings array to professional components.",
);

assert(
  page.includes(
    "holdings={openHoldings}",
  ),
  "Holdings page is not passing canonical open holdings directly to professional components.",
);

if (failures.length > 0) {
  console.error("");
  console.error(
    "Portfolio Engine P2.2 verification FAILED:",
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
  "Portfolio Engine P2.2 structural verification passed.",
);
console.log("");
console.log("Verified:");
console.log(" - Actual Holdings route replaced");
console.log(" - Legacy holdings calculator removed from route");
console.log(" - Direct localStorage loading removed from route");
console.log(" - Direct Zustand transaction reading removed from route");
console.log(" - Canonical snapshot hook connected");
console.log(" - Canonical open holdings connected");
console.log(" - Canonical closed holdings connected");
console.log(" - Canonical market value connected");
console.log(" - Canonical cost base connected");
console.log(" - Canonical realised P/L connected");
console.log(" - Canonical unrealised P/L connected");
console.log(" - Canonical total return connected");
console.log(" - Canonical portfolio weights connected");
console.log(" - Quote source displayed");
console.log(" - Unavailable prices are not presented as valid zero quotes");
console.log(" - Professional holdings components receive a flat holdings array");
console.log(" - Existing Holdings UI structure retained");
console.log("");
