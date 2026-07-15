#!/usr/bin/env node

import process from "node:process";

const baseUrl =
  process.env.MARKET_DATA_SMOKE_BASE_URL ||
  process.argv[2] ||
  "http://localhost:3000";

const endpoints = [
  {
    name: "Provider health",
    path: "/api/market-data/health",
    method: "GET",
  },
  {
    name: "Cache diagnostics",
    path: "/api/market-data/cache",
    method: "GET",
  },
  {
    name: "Refresh diagnostics",
    path: "/api/market-data/refresh",
    method: "GET",
  },
  {
    name: "Market hours",
    path: "/api/market-data/market-hours",
    method: "GET",
  },
  {
    name: "Single quote validation",
    path: "/api/market-data/quote",
    method: "GET",
    expectedStatus: 400,
  },
];

const failures = [];

console.log("");
console.log("LGRBZ-HUB V2 — Market Data Endpoint Smoke Test");
console.log(`Base URL: ${baseUrl}`);
console.log("");

for (const endpoint of endpoints) {
  const url =
    new URL(
      endpoint.path,
      baseUrl
    );

  const started =
    performance.now();

  try {
    const response =
      await fetch(
        url,
        {
          method:
            endpoint.method,

          headers: {
            Accept:
              "application/json",
          },
        }
      );

    const duration =
      Math.round(
        performance.now() -
        started
      );

    let body =
      null;

    try {
      body =
        await response.json();
    } catch {
      body =
        null;
    }

    const expectedStatus =
      endpoint.expectedStatus;

    const successful =
      expectedStatus
        ? response.status ===
          expectedStatus
        : response.ok;

    if (!successful) {
      failures.push(
        `${endpoint.name} returned ${response.status}.`
      );

      console.log(
        `❌ ${endpoint.name}: ${response.status} (${duration} ms)`
      );

      continue;
    }

    if (
      body &&
      typeof body ===
        "object" &&
      "ok" in body &&
      expectedStatus ===
        undefined &&
      body.ok !== true
    ) {
      failures.push(
        `${endpoint.name} returned an unsuccessful envelope.`
      );

      console.log(
        `❌ ${endpoint.name}: unsuccessful envelope (${duration} ms)`
      );

      continue;
    }

    console.log(
      `✅ ${endpoint.name}: ${response.status} (${duration} ms)`
    );
  } catch (error) {
    failures.push(
      `${endpoint.name}: ${
        error instanceof Error
          ? error.message
          : "Unknown request failure."
      }`
    );

    console.log(
      `❌ ${endpoint.name}: request failed`
    );
  }
}

console.log("");

if (failures.length > 0) {
  console.error(
    "Market-data endpoint smoke test failed:"
  );

  for (const failure of failures) {
    console.error(
      `  - ${failure}`
    );
  }

  console.error("");
  process.exit(1);
}

console.log(
  "✅ All market-data endpoint smoke tests passed."
);
console.log("");
