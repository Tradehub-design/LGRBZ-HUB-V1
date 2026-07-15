#!/usr/bin/env node

import {
  spawnSync,
} from "node:child_process";
import fs from "node:fs";
import process from "node:process";

const packageJson =
  JSON.parse(
    fs.readFileSync(
      "package.json",
      "utf8"
    )
  );

const preferredScripts = [
  "verify:market-data-10-1",
  "verify:market-data-10-2",
  "verify:market-data-10-3",
  "verify:market-data-10-4",
  "verify:market-data-10-5",
  "verify:market-data-10-6",
  "verify:market-data-10-7",
  "verify:market-data-10-8",
  "verify:market-data-10-9",
  "verify:market-data-10-10",
  "regression:market-data-sprint-10",
];

const available =
  preferredScripts.filter(
    (
      script
    ) =>
      Boolean(
        packageJson.scripts?.[
          script
        ]
      )
  );

const failures = [];

console.log("");
console.log(
  "LGRBZ-HUB V2 — Sprint 10 Aggregate Verification"
);
console.log("");

for (const script of available) {
  console.log(
    `Running ${script}...`
  );

  const result =
    spawnSync(
      "npm",
      [
        "run",
        script,
      ],
      {
        stdio: "inherit",
        shell:
          process.platform ===
          "win32",
      }
    );

  if (
    result.status !==
    0
  ) {
    failures.push(
      script
    );
  }
}

console.log("");

if (failures.length > 0) {
  console.error(
    "❌ Sprint 10 aggregate verification failed:"
  );

  for (const failure of failures) {
    console.error(
      `   - ${failure}`
    );
  }

  console.error("");
  process.exit(1);
}

console.log(
  `✅ ${available.length} Sprint 10 verification scripts passed.`
);
console.log(
  "✅ Market Data Reliability Sprint 10 is complete."
);
console.log("");
