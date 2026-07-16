import fs from "node:fs";
import path from "node:path";

const root =
  process.cwd();

const failures = [];

const files = {
  dashboardHook:
    "src/core/portfolio-engine/client/useUnifiedPortfolioDashboard.ts",

  intelligenceHook:
    "src/core/portfolio-engine/client/usePortfolioIntelligence.ts",

  dashboardBuild:
    "src/core/portfolio-engine/dashboard/build.ts",

  analyticsBuild:
    "src/core/portfolio-engine/analytics/build.ts",

  taxBuild:
    "src/core/portfolio-engine/tax/build.ts",

  reportBuild:
    "src/core/portfolio-engine/reports/build.ts",
};

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
      `Missing lineage file: ${relativePath}`,
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

function requireFlow(
  content,
  tokens,
  label,
) {
  const compacted =
    compact(content);

  for (
    const token of
    tokens
  ) {
    if (
      !compacted.includes(
        compact(token),
      )
    ) {
      failures.push(
        `${label} is missing lineage token: ${token}`,
      );
    }
  }
}

const dashboardHook =
  read(
    files.dashboardHook,
  );

const intelligenceHook =
  read(
    files.intelligenceHook,
  );

const dashboardBuild =
  read(
    files.dashboardBuild,
  );

const analyticsBuild =
  read(
    files.analyticsBuild,
  );

const taxBuild =
  read(
    files.taxBuild,
  );

const reportBuild =
  read(
    files.reportBuild,
  );

requireFlow(
  dashboardHook,
  [
    "usePortfolioDividendEngine",
    "dividendEngine.portfolio",
    "dividendEngine.dividendSnapshot",
    "buildPortfolioDashboardSnapshot",
  ],
  "Dashboard lineage",
);

requireFlow(
  dashboardBuild,
  [
    "portfolioSnapshotId",
    "dividendSnapshotId",
    "input.portfolio.snapshotId",
    "input.dividends.snapshotId",
    "input.portfolio.openHoldings",
    "input.portfolio.totals",
    "input.portfolio.allocation",
    "input.dividends.totals",
  ],
  "Dashboard Snapshot lineage",
);

requireFlow(
  intelligenceHook,
  [
    "useUnifiedPortfolioDashboard",
    "buildPortfolioAnalyticsSnapshot",
    "buildPortfolioTaxSnapshot",
    "buildPortfolioReportSnapshot",
    "dashboard: unified.dashboard",
  ],
  "Portfolio Intelligence lineage",
);

requireFlow(
  analyticsBuild,
  [
    "dashboardSnapshotId",
    "portfolioSnapshotId",
    "dividendSnapshotId",
    "input.dashboard.dashboardSnapshotId",
    "input.dashboard.portfolioSnapshotId",
    "input.dashboard.dividendSnapshotId",
  ],
  "Analytics Snapshot lineage",
);

requireFlow(
  taxBuild,
  [
    "portfolioSnapshotId",
    "dividendSnapshotId",
    "dashboardSnapshotId",
    "input.dashboard.portfolioSnapshotId",
    "input.dashboard.dividendSnapshotId",
    "input.dashboard.dashboardSnapshotId",
  ],
  "Tax Snapshot lineage",
);

requireFlow(
  reportBuild,
  [
    "portfolioSnapshotId",
    "dashboardSnapshotId",
    "analyticsSnapshotId",
    "dividendSnapshotId",
    "input.analytics.analyticsSnapshotId",
    "input.tax.portfolioSnapshotId",
    "input.tax.dividendSnapshotId",
    "input.tax.dashboardSnapshotId",
  ],
  "Report Snapshot lineage",
);

if (
  failures.length >
  0
) {
  console.error("");
  console.error(
    "Portfolio Engine lineage verification FAILED:",
  );
  console.error("");

  for (
    const failure of
    failures
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
  "Portfolio Engine lineage verification passed.",
);
console.log("");
console.log("Verified lineage:");
console.log(" Transactions");
console.log("   -> Portfolio Snapshot");
console.log("   -> Live-valued Holdings");
console.log("   -> Dividend Snapshot");
console.log("   -> Dashboard Snapshot");
console.log("   -> Analytics Snapshot");
console.log("   -> Tax Snapshot");
console.log("   -> Report Snapshot");
console.log("");
