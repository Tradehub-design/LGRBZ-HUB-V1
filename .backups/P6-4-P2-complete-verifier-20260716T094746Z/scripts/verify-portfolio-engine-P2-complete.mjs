import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const requiredFiles = [
  "src/core/portfolio-engine/contracts.ts",
  "src/core/portfolio-engine/ledger.ts",
  "src/core/portfolio-engine/replay.ts",
  "src/core/portfolio-engine/snapshot.ts",
  "src/core/portfolio-engine/reconcile.ts",
  "src/core/portfolio-engine/engine.ts",
  "src/core/portfolio-engine/adapters/ledger-row-adapter.ts",
  "src/core/portfolio-engine/adapters/holding-compatibility.ts",
  "src/core/portfolio-engine/client/usePortfolioEngineSnapshot.ts",
  "src/core/portfolio-engine/client/holdings-reconciliation.ts",
  "src/core/portfolio-engine/client/selectors.ts",
  "src/app/(dashboard)/holdings/page.tsx",
  "src/lib/holdings-professional/holdingsVisualEngine.ts",
  "src/components/professional-overview/portfolioOverviewNormaliser.ts",
];

const failures = [];

for (const relativePath of requiredFiles) {
  const absolutePath =
    path.join(
      root,
      relativePath,
    );

  if (!fs.existsSync(absolutePath)) {
    failures.push(
      `Missing P2 file: ${relativePath}`,
    );
  }
}

const holdingsPage =
  fs.readFileSync(
    path.join(
      root,
      "src/app/(dashboard)/holdings/page.tsx",
    ),
    "utf8",
  );

if (
  holdingsPage.includes(
    "calculateHoldingsFromLedger",
  )
) {
  failures.push(
    "Holdings route still imports the legacy holdings calculator.",
  );
}

if (
  !holdingsPage.includes(
    "usePortfolioEngineSnapshot",
  )
) {
  failures.push(
    "Holdings route is not connected to the canonical Portfolio Engine.",
  );
}

const applicationSourceFiles = [
  "src/app/(dashboard)/holdings/page.tsx",
  "src/core/portfolio-engine/client/usePortfolioEngineSnapshot.ts",
  "src/core/portfolio-engine/adapters/holding-compatibility.ts",
  "src/lib/holdings-professional/holdingsVisualEngine.ts",
  "src/components/professional-overview/portfolioOverviewNormaliser.ts",
];

for (const relativePath of applicationSourceFiles) {
  const content =
    fs.readFileSync(
      path.join(root, relativePath),
      "utf8",
    );

  if (
    /Math\.random\s*\(/.test(
      content,
    )
  ) {
    failures.push(
      `${relativePath} contains non-deterministic portfolio logic.`,
    );
  }
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "Complete Sprint P2 verification FAILED:",
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
  "Complete Sprint P2 verification passed.",
);
console.log("");
console.log(
  "The Holdings route, professional widgets and compatibility layer now consume the canonical Portfolio Engine.",
);
console.log("");
