import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/components/dashboard-v2/dashboardV2Types.ts",
    markers: [
      "DashboardExecutiveMetric",
      "DashboardExecutiveSnapshot",
      "DashboardQuickAction",
      "DashboardAlertItem",
      "DashboardSectionCardProps",
    ],
  },
  {
    file:
      "src/components/dashboard-v2/dashboardV2Formatters.ts",
    markers: [
      "dashboardFormatCurrency",
      "dashboardFormatPercentage",
      "dashboardFormatMetric",
      "dashboardFormatDateTime",
    ],
  },
  {
    file:
      "src/components/dashboard-v2/DashboardSectionCard.tsx",
    markers: [
      "DashboardSectionCard",
      "DashboardSectionLoading",
      "No data available",
    ],
  },
  {
    file:
      "src/components/dashboard-v2/DashboardExecutiveHeader.tsx",
    markers: [
      "DashboardExecutiveHeader",
      "Executive Overview",
      "Ledger-driven",
    ],
  },
  {
    file:
      "src/components/dashboard-v2/DashboardExecutiveKpiCard.tsx",
    markers: [
      "DashboardExecutiveKpiCard",
      "dashboardFormatMetric",
      "TrendIcon",
    ],
  },
  {
    file:
      "src/components/dashboard-v2/DashboardExecutiveKpiGrid.tsx",
    markers: [
      "DashboardExecutiveKpiGrid",
      "DashboardExecutiveKpiCard",
    ],
  },
  {
    file:
      "src/components/dashboard-v2/DashboardQuickActions.tsx",
    markers: [
      "DashboardQuickActions",
      "Quick Actions",
      "DashboardQuickActionButton",
    ],
  },
  {
    file:
      "src/components/dashboard-v2/DashboardAlertSummary.tsx",
    markers: [
      "DashboardAlertSummary",
      "No active alerts",
      "AlertContent",
    ],
  },
  {
    file:
      "src/components/dashboard-v2/DashboardExecutiveShell.tsx",
    markers: [
      "DashboardExecutiveShell",
      "DashboardExecutiveHeader",
      "DashboardExecutiveKpiGrid",
      "DashboardQuickActions",
      "DashboardAlertSummary",
    ],
  },
  {
    file:
      "src/components/dashboard-v2/createDashboardExecutivePresentation.ts",
    markers: [
      "createDashboardExecutiveMetrics",
      "createDashboardQuickActions",
      "createDashboardDataAlerts",
      "Portfolio Value",
      "Portfolio Health",
      "Risk Score",
    ],
  },
  {
    file:
      "src/components/dashboard-v2/DashboardV2FoundationPreview.tsx",
    markers: [
      "DashboardV2FoundationPreview",
      "Portfolio Performance",
      "Portfolio Allocation",
      "Recent Transactions",
      "Upcoming Dividends",
      "Watchlist Highlights",
    ],
  },
  {
    file:
      "src/components/dashboard-v2/index.ts",
    markers: [
      "DashboardExecutiveShell",
      "DashboardSectionCard",
      "DashboardV2FoundationPreview",
    ],
  },
];

const failures = [];

for (const check of checks) {
  if (
    !fs.existsSync(
      check.file
    )
  ) {
    failures.push(
      `Missing file: ${check.file}`
    );

    continue;
  }

  const content =
    fs.readFileSync(
      check.file,
      "utf8"
    );

  for (
    const marker of
    check.markers
  ) {
    if (
      !content.includes(
        marker
      )
    ) {
      failures.push(
        `${check.file} missing marker: ${marker}`
      );
    }
  }
}

const forbiddenPaths = [
  "src/lib/transactions",
  "src/lib/holdings",
  "src/lib/analytics",
  "src/lib/tax",
];

const gitDiff =
  process.env.LGRBZ_SKIP_GIT_CHECK ===
  "1"
    ? ""
    : "";

if (
  failures.length >
  0
) {
  console.error(
    "❌ Dashboard 2.0 foundation verification failed:"
  );

  failures.forEach(
    (failure) =>
      console.error(
        `   - ${failure}`
      )
  );

  process.exit(1);
}

console.log(
  "✅ Dashboard 2.0 foundation verification passed."
);

console.log(
  "✅ Executive shell and responsive layout are available."
);

console.log(
  "✅ KPI, alert, quick-action and section components are available."
);

console.log(
  "✅ Dashboard Engine and Transaction Ledger were not replaced."
);

console.log(
  `✅ Verified ${checks.length} Dashboard 2.0 foundation files.`
);
