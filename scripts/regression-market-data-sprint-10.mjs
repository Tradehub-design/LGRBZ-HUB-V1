#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root =
  process.cwd();

const failures = [];
const warnings = [];

function exists(
  relativePath
) {
  return fs.existsSync(
    path.join(
      root,
      relativePath
    )
  );
}

function read(
  relativePath
) {
  return fs.readFileSync(
    path.join(
      root,
      relativePath
    ),
    "utf8"
  );
}

function walk(
  directory,
  extensionFilter = null
) {
  const absolute =
    path.join(
      root,
      directory
    );

  if (
    !fs.existsSync(
      absolute
    )
  ) {
    return [];
  }

  const results = [];

  for (
    const entry of
    fs.readdirSync(
      absolute,
      {
        withFileTypes: true,
      }
    )
  ) {
    const relative =
      path.join(
        directory,
        entry.name
      );

    if (
      entry.isDirectory()
    ) {
      results.push(
        ...walk(
          relative,
          extensionFilter
        )
      );

      continue;
    }

    if (
      !extensionFilter ||
      extensionFilter.some(
        (
          extension
        ) =>
          entry.name.endsWith(
            extension
          )
      )
    ) {
      results.push(
        relative
      );
    }
  }

  return results;
}

const requiredFiles = [
  "src/lib/market-data/marketDataTypes.ts",
  "src/lib/market-data/multiProviderQuoteResolver.ts",
  "src/lib/market-data/memoryMarketDataCache.ts",
  "src/lib/market-data/providerHealth.ts",
  "src/lib/market-data/providerRegistry.ts",
  "src/lib/market-data/marketClock.ts",
  "src/lib/market-data/client/liveQuoteStore.ts",
  "src/lib/market-data/client/liveQuoteApiClient.ts",
  "src/hooks/useLiveMarketQuote.ts",
  "src/hooks/useLiveMarketQuotes.ts",
  "src/app/api/market-data/quote/route.ts",
  "src/app/api/market-data/quotes/route.ts",
  "src/app/api/market-data/health/route.ts",
  "src/app/api/market-data/cache/route.ts",
  "src/app/api/market-data/refresh/route.ts",
  "src/components/market-data/MarketDataReliabilityCentre.tsx",
  "src/app/(dashboard)/market-data-health/page.tsx",
];

for (const file of requiredFiles) {
  if (!exists(file)) {
    failures.push(
      `Missing required Sprint 10 file: ${file}`
    );
  }
}

const routeFiles =
  walk(
    "src/app/api/market-data",
    [
      "route.ts",
      "route.tsx",
    ]
  );

const routeKeys =
  new Map();

for (const file of routeFiles) {
  const key =
    path.dirname(file);

  if (
    routeKeys.has(
      key
    )
  ) {
    failures.push(
      `Duplicate market-data route detected: ${key}`
    );
  }

  routeKeys.set(
    key,
    file
  );
}

const indexFiles = [
  "src/lib/market-data/index.ts",
  "src/lib/market-data/client/index.ts",
  "src/components/market-data/index.ts",
];

for (const file of indexFiles) {
  if (!exists(file)) {
    continue;
  }

  const lines =
    read(file)
      .split(/\r?\n/)
      .map(
        (
          line
        ) =>
          line.trim()
      )
      .filter(
        (
          line
        ) =>
          line.startsWith(
            "export "
          )
      );

  const seen =
    new Set();

  for (const line of lines) {
    if (
      seen.has(
        line
      )
    ) {
      failures.push(
        `${file} contains duplicate export: ${line}`
      );
    }

    seen.add(
      line
    );
  }
}

const clientFiles =
  walk(
    "src/lib/market-data/client",
    [
      ".ts",
      ".tsx",
    ]
  );

for (const file of clientFiles) {
  const source =
    read(file);

  const usesBrowserApi =
    /\b(window|document|navigator|localStorage|sessionStorage)\b/.test(
      source
    );

  if (
    usesBrowserApi &&
    !source.startsWith(
      '"use client"'
    ) &&
    !source.startsWith(
      "'use client'"
    )
  ) {
    failures.push(
      `${file} uses browser APIs without a use-client boundary.`
    );
  }
}

const routeSources =
  routeFiles.map(
    (
      file
    ) => ({
      file,
      source:
        read(file),
    })
  );

for (
  const {
    file,
    source,
  } of routeSources
) {
  if (
    source.includes(
      '"use client"'
    ) ||
    source.includes(
      "'use client'"
    )
  ) {
    failures.push(
      `${file} is an API route but contains a use-client directive.`
    );
  }

  if (
    source.includes(
      "Math.random() * 100"
    ) ||
    source.includes(
      "mockQuote"
    ) ||
    source.includes(
      "demoQuote"
    )
  ) {
    warnings.push(
      `${file} may contain demo market-data generation.`
    );
  }
}

const marketFiles = [
  ...walk(
    "src/lib/market-data",
    [
      ".ts",
      ".tsx",
    ]
  ),
  ...walk(
    "src/components/market-data",
    [
      ".ts",
      ".tsx",
    ]
  ),
];

for (const file of marketFiles) {
  const source =
    read(file);

  if (
    source.includes(
      "TODO_MARKET_DATA"
    ) ||
    source.includes(
      "REPLACE_WITH_PROVIDER"
    ) ||
    source.includes(
      "PLACEHOLDER_PRICE"
    )
  ) {
    failures.push(
      `${file} contains an unresolved market-data placeholder.`
    );
  }

  if (
    /api[_-]?key\s*[:=]\s*["'][A-Za-z0-9_-]{16,}["']/i.test(
      source
    )
  ) {
    failures.push(
      `${file} appears to contain a hard-coded API key.`
    );
  }
}

const packageJson =
  JSON.parse(
    read(
      "package.json"
    )
  );

const requiredScripts = [
  "typecheck",
  "build",
  "verify:market-data-10-10",
  "verify:market-data-sprint-10",
  "regression:market-data-sprint-10",
  "smoke:market-data",
];

for (const script of requiredScripts) {
  if (
    !packageJson.scripts ||
    !packageJson.scripts[
      script
    ]
  ) {
    failures.push(
      `package.json is missing script: ${script}`
    );
  }
}

console.log("");
console.log(
  "LGRBZ-HUB V2 — Sprint 10 Static Regression"
);
console.log("");
console.log(
  `Market-data source files: ${marketFiles.length}`
);
console.log(
  `Market-data API routes: ${routeFiles.length}`
);
console.log(
  `Market-data client files: ${clientFiles.length}`
);
console.log("");

for (const warning of warnings) {
  console.warn(
    `⚠ ${warning}`
  );
}

if (failures.length > 0) {
  console.error("");
  console.error(
    "❌ Sprint 10 static regression failed:"
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
  "✅ Required market-data architecture is present."
);
console.log(
  "✅ No duplicate market-data routes were detected."
);
console.log(
  "✅ No duplicate market-data exports were detected."
);
console.log(
  "✅ Client/server boundaries passed."
);
console.log(
  "✅ No hard-coded market-data API keys were detected."
);
console.log(
  "✅ No unresolved market-data placeholders were detected."
);
console.log(
  "✅ Required package scripts are present."
);
console.log("");
