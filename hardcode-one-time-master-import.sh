#!/usr/bin/env bash
set -e

echo "🔧 Hard-coding one-time LGRBZ master workbook importer..."

cat > src/lib/import/excel/readMasterWorkbook.ts <<'TS'
import * as XLSX from "xlsx";

import { MasterTransactionRow } from "../types/masterWorkbook";

export interface MasterWorkbookImportResult {
  sheetNames: string[];
  detectedHeaders: Record<string, string>;
  transactions: MasterTransactionRow[];
}

function text(value: unknown, fallback = "") {
  const output = String(value ?? "").trim();
  return output || fallback;
}

function number(value: unknown) {
  if (typeof value === "number") return value;

  const cleaned = String(value ?? "")
    .replace(/,/g, "")
    .replace(/\$/g, "")
    .replace(/%/g, "")
    .trim();

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function dateText(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const raw = text(value);
  const parsed = new Date(raw);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return raw;
}

export async function readMasterWorkbook(
  file: File,
): Promise<MasterWorkbookImportResult> {
  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: true,
  });

  const worksheet = workbook.Sheets["Transactions"];

  if (!worksheet) {
    throw new Error("Transactions worksheet was not found.");
  }

  // Your workbook format is fixed:
  // Row 1 = title / section headings
  // Row 2 = actual headers
  // Row 3 onwards = transactions
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: "",
    raw: false,
    range: 1,
  });

  const transactions = rows
    .map((row): MasterTransactionRow => ({
      Date: dateText(row["Date"]),
      Action: text(row["Action"]),
      "Asset Ticker": text(row["Asset Ticker"]),
      "Crypto URL Name": text(row["Crypto URL Name"]),
      Quantity: number(row["Quantity"]),
      Price: number(row["Price"]),
      "Fiat Fees": number(row["Fiat Fees"]),
      Currency: text(row["Currency"], "AUD"),
      Platform: text(row["Platform"]),
      "Asset Class": text(row["Asset Class"], "Stock"),
      Sector: text(row["Sector"], "Unknown"),
      Country: text(row["Country"], "Australia"),
      Strategy: text(row["Strategy"], "Manual"),
      Notes: text(row["Notes"]),
      Total: number(row["Total"]),
    }))
    .filter((row) => row.Date && row.Action && row["Asset Ticker"]);

  return {
    sheetNames: workbook.SheetNames,
    detectedHeaders: {
      date: "Date",
      action: "Action",
      ticker: "Asset Ticker",
      cryptoUrlName: "Crypto URL Name",
      quantity: "Quantity",
      price: "Price",
      fees: "Fiat Fees",
      currency: "Currency",
      platform: "Platform",
      assetClass: "Asset Class",
      sector: "Sector",
      country: "Country",
      strategy: "Strategy",
      notes: "Notes",
      total: "Total",
    },
    transactions,
  };
}
TS

npm run build
