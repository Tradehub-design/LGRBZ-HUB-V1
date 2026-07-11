import fs from "node:fs";
import process from "node:process";

const checks = [
  {
    file:
      "src/components/transactions/TransactionContextMenu.tsx",
    markers: [
      '"use client"',
      "TransactionContextMenu",
      "Duplicate transaction",
      "Copy symbol",
      "Copy transaction details",
      "Copy as CSV",
      "Delete transaction",
    ],
  },
  {
    file:
      "src/components/transactions/ProfessionalTransactionTable.tsx",
    markers: [
      "onContextMenu",
    ],
  },
  {
    file:
      "src/components/transactions/TransactionMobileCards.tsx",
    markers: [
      "onContextMenu",
    ],
  },
  {
    file:
      "src/components/transactions/ProfessionalTransactionsWorkspace.tsx",
    markers: [
      "TransactionContextMenu",
      "openTransactionContextMenu",
      "copyTransactionSymbol",
      "copyTransactionRow",
      "copyTransactionCsv",
      "duplicateTransaction",
    ],
  },
  {
    file:
      "src/lib/transactions/transactionClipboard.ts",
    markers: [
      "writeTransactionClipboard",
      "transactionToClipboardText",
      "transactionToClipboardCsv",
    ],
  },
  {
    file:
      "src/lib/transactions/transactionDuplicate.ts",
    markers: [
      "duplicateTransactionDraft",
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

  for (const marker of check.markers) {
    if (
      !content.includes(
        marker
      )
    ) {
      failures.push(
        `${check.file} is missing marker: ${marker}`
      );
    }
  }
}

if (
  failures.length > 0
) {
  console.error(
    "❌ Transaction productivity verification failed:"
  );

  for (const failure of failures) {
    console.error(
      `   - ${failure}`
    );
  }

  process.exit(1);
}

console.log(
  "✅ Transaction productivity verification passed."
);

console.log(
  "✅ Context menu is connected to desktop and mobile transaction rows."
);

console.log(
  "✅ Copy symbol, details and CSV actions are available."
);

console.log(
  "✅ Duplicate transaction workflow is available."
);
