import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();

const requiredFiles = [
  "src/app/(dashboard)/transactions/page.tsx",
  "src/app/(dashboard)/transactions/professional-transactions-route.tsx",
  "src/app/(dashboard)/transactions/legacy-transactions-page.tsx",
  "src/app/(dashboard)/transactions/loading.tsx",
  "src/app/(dashboard)/transactions/error.tsx",
  "src/components/transactions/ProfessionalTransactionsWorkspace.tsx",
  "src/components/transactions/ProfessionalTransactionTable.tsx",
  "src/components/transactions/ProfessionalLedgerTransactions.tsx",
  "src/components/transactions/ProfessionalTransactionsSection.tsx",
  "src/components/transactions/TransactionToolbar.tsx",
  "src/components/transactions/TransactionSummaryCards.tsx",
  "src/components/transactions/TransactionPagination.tsx",
  "src/components/transactions/TransactionEditDrawer.tsx",
  "src/components/transactions/TransactionDeleteDialog.tsx",
  "src/components/transactions/TransactionAdvancedFilters.tsx",
  "src/components/transactions/TransactionPresetManager.tsx",
  "src/components/transactions/TransactionViewSettings.tsx",
  "src/components/transactions/TransactionQualityPanel.tsx",
  "src/components/transactions/TransactionToastViewport.tsx",
  "src/components/transactions/TransactionKeyboardHelp.tsx",
  "src/components/transactions/TransactionStickyWorkspaceBar.tsx",
  "src/lib/transactions/professionalTransactions.ts",
  "src/lib/transactions/professionalLedgerBridge.ts",
  "src/lib/transactions/transactionValidation.ts",
  "src/lib/transactions/transactionOptimisticState.ts",
  "src/lib/transactions/transactionPreferences.ts",
  "src/lib/transactions/transactionTablePreferences.ts",
  "src/lib/transactions/transactionKeyboard.ts",
  "src/lib/transactions/transactionToast.ts",
  "src/lib/transactions/transactionQuality.ts",
  "src/lib/transactions/ledgerStorage.ts",
];

const requiredMarkers = {
  "src/app/(dashboard)/transactions/page.tsx": [
    "professional-transactions-route",
  ],
  "src/app/(dashboard)/transactions/professional-transactions-route.tsx": [
    '"use client"',
    "ProfessionalTransactionsRoute",
    "ProfessionalTransactionsSection",
    "LegacyTransactionsPage",
  ],
  "src/app/(dashboard)/transactions/legacy-transactions-page.tsx": [
    "export default",
  ],
  "src/components/transactions/ProfessionalTransactionsWorkspace.tsx": [
    '"use client"',
    "ProfessionalTransactionsWorkspace",
    "TransactionToolbar",
    "ProfessionalTransactionTable",
    "TransactionPagination",
    "TransactionEditDrawer",
    "TransactionDeleteDialog",
  ],
  "src/components/transactions/ProfessionalLedgerTransactions.tsx": [
    '"use client"',
    "loadProfessionalTransactions",
    "updateProfessionalLedgerTransaction",
    "deleteProfessionalLedgerTransaction",
    "deleteProfessionalLedgerTransactions",
    "restoreProfessionalLedgerTransactions",
  ],
  "src/lib/transactions/professionalLedgerBridge.ts": [
    "loadTxLedger",
    "saveTxLedger",
    "updateProfessionalLedgerTransaction",
    "deleteProfessionalLedgerTransaction",
    "deleteProfessionalLedgerTransactions",
    "restoreProfessionalLedgerTransactions",
  ],
};

const clientFiles = [
  "src/app/(dashboard)/transactions/professional-transactions-route.tsx",
  "src/app/(dashboard)/transactions/error.tsx",
  "src/components/transactions/ProfessionalTransactionsWorkspace.tsx",
  "src/components/transactions/ProfessionalLedgerTransactions.tsx",
  "src/components/transactions/ProfessionalTransactionsSection.tsx",
  "src/components/transactions/ProfessionalTransactionTable.tsx",
  "src/components/transactions/TransactionToolbar.tsx",
  "src/components/transactions/TransactionEditDrawer.tsx",
  "src/components/transactions/TransactionDeleteDialog.tsx",
  "src/components/transactions/TransactionAdvancedFilters.tsx",
  "src/components/transactions/TransactionPresetManager.tsx",
  "src/components/transactions/TransactionViewSettings.tsx",
  "src/components/transactions/TransactionToastViewport.tsx",
  "src/components/transactions/TransactionKeyboardHelp.tsx",
  "src/components/transactions/TransactionStickyWorkspaceBar.tsx",
];

const failures = [];
const warnings = [];

function fullPath(relativePath) {
  return path.join(
    root,
    relativePath
  );
}

function read(relativePath) {
  return fs.readFileSync(
    fullPath(relativePath),
    "utf8"
  );
}

function firstMeaningfulLine(content) {
  return (
    content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(
        (line) =>
          line &&
          !line.startsWith("//") &&
          !line.startsWith("/*") &&
          !line.startsWith("*")
      ) ?? ""
  );
}

console.log(
  "🔎 Verifying Professional Transactions..."
);

for (const relativePath of requiredFiles) {
  if (
    !fs.existsSync(
      fullPath(relativePath)
    )
  ) {
    failures.push(
      `Missing required file: ${relativePath}`
    );
  }
}

for (const [
  relativePath,
  markers,
] of Object.entries(
  requiredMarkers
)) {
  if (
    !fs.existsSync(
      fullPath(relativePath)
    )
  ) {
    continue;
  }

  const content =
    read(relativePath);

  for (const marker of markers) {
    if (
      !content.includes(
        marker
      )
    ) {
      failures.push(
        `${relativePath} is missing marker: ${marker}`
      );
    }
  }
}

for (const relativePath of clientFiles) {
  if (
    !fs.existsSync(
      fullPath(relativePath)
    )
  ) {
    continue;
  }

  const content =
    read(relativePath);

  const firstLine =
    firstMeaningfulLine(
      content
    );

  if (
    firstLine !==
      '"use client";' &&
    firstLine !==
      "'use client';"
  ) {
    failures.push(
      `${relativePath} must begin with the "use client" directive.`
    );
  }
}

const pagePath =
  "src/app/(dashboard)/transactions/page.tsx";

if (
  fs.existsSync(
    fullPath(pagePath)
  )
) {
  const pageContent =
    read(pagePath);

  if (
    pageContent.includes(
      "loadTxLedger"
    ) ||
    pageContent.includes(
      "clearTxLedger"
    ) ||
    pageContent.includes(
      "applyLedger"
    )
  ) {
    warnings.push(
      "The route entry file still contains direct ledger operations. Expected the preserved legacy page to own those operations."
    );
  }
}

const routePath =
  "src/app/(dashboard)/transactions/professional-transactions-route.tsx";

if (
  fs.existsSync(
    fullPath(routePath)
  )
) {
  const routeContent =
    read(routePath);

  if (
    !routeContent.includes(
      "legacy-transactions-page"
    )
  ) {
    failures.push(
      "Professional route does not reference the preserved legacy Transactions page."
    );
  }

  if (
    !routeContent.includes(
      "lgrbz.transactions.route-view.v1"
    )
  ) {
    warnings.push(
      "Transactions view preference persistence was not found."
    );
  }
}

const bridgePath =
  "src/lib/transactions/professionalLedgerBridge.ts";

if (
  fs.existsSync(
    fullPath(bridgePath)
  )
) {
  const bridgeContent =
    read(bridgePath);

  const dangerousMarkers = [
    "clearTxLedger(",
    "localStorage.clear(",
    "sessionStorage.clear(",
  ];

  for (const marker of dangerousMarkers) {
    if (
      bridgeContent.includes(
        marker
      )
    ) {
      failures.push(
        `Ledger bridge contains prohibited destructive operation: ${marker}`
      );
    }
  }
}

const workspacePath =
  "src/components/transactions/ProfessionalTransactionsWorkspace.tsx";

if (
  fs.existsSync(
    fullPath(workspacePath)
  )
) {
  const workspaceContent =
    read(workspacePath);

  const capabilities = [
    [
      "Search",
      "filters",
    ],
    [
      "Pagination",
      "TransactionPagination",
    ],
    [
      "Editing",
      "TransactionEditDrawer",
    ],
    [
      "Deletion",
      "TransactionDeleteDialog",
    ],
    [
      "Bulk actions",
      "TransactionBulkActionBar",
    ],
    [
      "CSV export",
      "transactionsToCsv",
    ],
    [
      "Keyboard controls",
      "resolveTransactionKeyboardCommand",
    ],
    [
      "Quality review",
      "TransactionQualityPanel",
    ],
    [
      "Responsive cards",
      "TransactionMobileCards",
    ],
    [
      "Notifications",
      "TransactionToastViewport",
    ],
  ];

  for (const [
    capability,
    marker,
  ] of capabilities) {
    if (
      !workspaceContent.includes(
        marker
      )
    ) {
      failures.push(
        `Workspace capability missing: ${capability} (${marker})`
      );
    }
  }
}

const packagePath =
  fullPath(
    "package.json"
  );

if (
  fs.existsSync(
    packagePath
  )
) {
  try {
    const packageJson =
      JSON.parse(
        fs.readFileSync(
          packagePath,
          "utf8"
        )
      );

    if (
      !packageJson.scripts
    ) {
      warnings.push(
        "package.json does not contain a scripts object."
      );
    }
  } catch (error) {
    failures.push(
      `package.json could not be parsed: ${
        error instanceof Error
          ? error.message
          : String(error)
      }`
    );
  }
}

console.log("");

if (
  warnings.length > 0
) {
  console.log(
    "⚠️ Warnings:"
  );

  for (const warning of warnings) {
    console.log(
      `   - ${warning}`
    );
  }

  console.log("");
}

if (
  failures.length > 0
) {
  console.error(
    "❌ Professional Transactions verification failed:"
  );

  for (const failure of failures) {
    console.error(
      `   - ${failure}`
    );
  }

  process.exit(1);
}

console.log(
  "✅ Professional Transactions verification passed."
);

console.log(
  `✅ Checked ${requiredFiles.length} required files.`
);

console.log(
  "✅ Existing ledger route preservation confirmed."
);

console.log(
  "✅ Ledger bridge destructive-operation check passed."
);

console.log(
  "✅ Core professional transaction capabilities confirmed."
);
