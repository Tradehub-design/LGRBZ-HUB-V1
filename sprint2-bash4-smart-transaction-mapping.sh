#!/usr/bin/env bash
set -e

echo "🔧 Sprint 2 - Bash 4/5: Smart transaction mapping..."

mkdir -p src/lib/import/mapping src/lib/import/excel src/lib/import/types

cat > src/lib/import/mapping/mapRowByHeaders.ts <<'TS'
export function mapRowByHeaders(
  row: Record<string, unknown>,
  detectedHeaders: Record<string, string>,
) {
  function get(field: string, fallback: unknown = "") {
    const column = detectedHeaders[field];
    if (!column) return fallback;

    const value = row[column];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  return {
    Date: get("date"),
    Action: get("action"),
    "Asset Ticker": get("ticker"),
    "Crypto URL Name": get("cryptoUrlName"),
    Quantity: get("quantity", 0),
    Price: get("price", 0),
    "Fiat Fees": get("fees", 0),
    Currency: get("currency", "AUD"),
    Platform: get("platform"),
    "Asset Class": get("assetClass"),
    Sector: get("sector"),
    Country: get("country"),
    Strategy: get("strategy"),
    Notes: get("notes"),
    Total: get("total", 0),
  };
}
TS

cat > src/lib/import/excel/readMasterWorkbook.ts <<'TS'
import * as XLSX from "xlsx";

import { inspectWorkbook } from "../mapping/inspectWorkbook";
import { mapRowByHeaders } from "../mapping/mapRowByHeaders";
import { MasterTransactionRow } from "../types/masterWorkbook";

export interface MasterWorkbookImportResult {
  sheetNames: string[];
  detectedHeaders: Record<string, string>;
  transactions: MasterTransactionRow[];
}

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;

  const cleaned = String(value ?? "")
    .replace(/,/g, "")
    .replace(/\$/g, "")
    .replace(/%/g, "")
    .trim();

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toString(value: unknown, fallback = ""): string {
  const output = String(value ?? "").trim();
  return output.length ? output : fallback;
}

function normaliseRow(row: Record<string, unknown>): MasterTransactionRow {
  return {
    Date: toString(row.Date),
    Action: toString(row.Action),
    "Asset Ticker": toString(row["Asset Ticker"]),
    "Crypto URL Name": toString(row["Crypto URL Name"]),
    Quantity: toNumber(row.Quantity),
    Price: toNumber(row.Price),
    "Fiat Fees": toNumber(row["Fiat Fees"]),
    Currency: toString(row.Currency, "AUD"),
    Platform: toString(row.Platform),
    "Asset Class": toString(row["Asset Class"], "Equity"),
    Sector: toString(row.Sector, "Uncategorised"),
    Country: toString(row.Country, "Australia"),
    Strategy: toString(row.Strategy, "Manual"),
    Notes: toString(row.Notes),
    Total: toNumber(row.Total),
  };
}

export async function readMasterWorkbook(
  file: File,
): Promise<MasterWorkbookImportResult> {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: true,
  });

  const transactionsSheetName =
    workbook.SheetNames.find((name) => name.trim().toLowerCase() === "transactions") ??
    workbook.SheetNames.find((name) => name.trim().toLowerCase().includes("transaction"));

  if (!transactionsSheetName) {
    throw new Error("Could not find Transactions worksheet.");
  }

  const worksheet = workbook.Sheets[transactionsSheetName];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: "",
    raw: false,
  });

  const detectedHeaders = inspectWorkbook(rows);

  const transactions = rows
    .map((row) => normaliseRow(mapRowByHeaders(row, detectedHeaders)))
    .filter((row) => row.Date || row.Action || row["Asset Ticker"]);

  return {
    sheetNames: workbook.SheetNames,
    detectedHeaders,
    transactions,
  };
}
TS

npm run build
