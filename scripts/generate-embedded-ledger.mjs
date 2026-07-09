import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";

const input = path.join(process.cwd(), "data", "LGRBZ PORTFOLIO.xlsx");
const output = path.join(process.cwd(), "src", "data", "generated", "embedded-ledger.ts");

if (!fs.existsSync(input)) {
  throw new Error("Missing data/LGRBZ PORTFOLIO.xlsx");
}

const workbook = XLSX.readFile(input, { cellDates: true });
const sheet = workbook.Sheets["Transactions"];

if (!sheet) throw new Error("Transactions sheet not found");

const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
const headers = rows[1];

const wanted = {
  date: "Date",
  action: "Action",
  assetTicker: "Asset Ticker",
  cryptoUrlName: "Crypto URL Name",
  quantity: "Quantity",
  price: "Price",
  fiatFees: "Fiat Fees",
  currency: "Currency",
  platform: "Platform",
  assetClass: "Asset Class",
  sector: "Sector",
  country: "Country",
  strategy: "Strategy",
  notes: "Notes",
  total: "Total",
  totalFeesIncluded: "Total\n(Fees Included)",
  totalAud: "Total (AUD)",
  totalFeesIncludedAud: "Total \n(Fees Included) (AUD)",
  fiatFeesAud: "Fiat Fees (AUD)",
  rollingQuantity: "Rolling Quantity",
  realisedPlAud: "Realised P/L (AUD)",
};

function idx(name) {
  return headers.findIndex((h) => String(h).trim() === name.trim());
}

const indexes = Object.fromEntries(
  Object.entries(wanted).map(([key, header]) => [key, idx(header)]),
);

function cell(row, key) {
  const i = indexes[key];
  return i >= 0 ? row[i] : "";
}

function dateToIso(value) {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toISOString().slice(0, 10);
}

function num(value) {
  if (value === "" || value === null || value === undefined) return 0;
  return Number(String(value).replace(/,/g, "")) || 0;
}

const transactions = rows
  .slice(2)
  .map((row, index) => ({
    id: `xlsx-${index + 1}`,
    date: dateToIso(cell(row, "date")),
    action: String(cell(row, "action") || "").trim(),
    assetTicker: String(cell(row, "assetTicker") || "").trim(),
    cryptoUrlName: String(cell(row, "cryptoUrlName") || "").trim(),
    quantity: num(cell(row, "quantity")),
    price: num(cell(row, "price")),
    fiatFees: num(cell(row, "fiatFees")),
    currency: String(cell(row, "currency") || "AUD").trim(),
    platform: String(cell(row, "platform") || "").trim(),
    assetClass: String(cell(row, "assetClass") || "").trim(),
    sector: String(cell(row, "sector") || "").trim(),
    country: String(cell(row, "country") || "").trim(),
    strategy: String(cell(row, "strategy") || "").trim(),
    notes: String(cell(row, "notes") || "").trim(),
    total: num(cell(row, "total")),
    totalFeesIncluded: num(cell(row, "totalFeesIncluded")),
    totalAud: num(cell(row, "totalAud")),
    totalFeesIncludedAud: num(cell(row, "totalFeesIncludedAud")),
    fiatFeesAud: num(cell(row, "fiatFeesAud")),
    rollingQuantity: num(cell(row, "rollingQuantity")),
    realisedPlAud: num(cell(row, "realisedPlAud")),
  }))
  .filter((row) => row.date && row.action && row.assetTicker);

const code = `/* Auto-generated from data/LGRBZ PORTFOLIO.xlsx */
/* Do not edit manually. Re-run npm run generate:ledger */

export type EmbeddedLedgerTransaction = ${JSON.stringify({
  id: "",
  date: "",
  action: "",
  assetTicker: "",
  cryptoUrlName: "",
  quantity: 0,
  price: 0,
  fiatFees: 0,
  currency: "",
  platform: "",
  assetClass: "",
  sector: "",
  country: "",
  strategy: "",
  notes: "",
  total: 0,
  totalFeesIncluded: 0,
  totalAud: 0,
  totalFeesIncludedAud: 0,
  fiatFeesAud: 0,
  rollingQuantity: 0,
  realisedPlAud: 0,
}, null, 2).replace(/"[^"]+":/g, (m) => m.replace(/"/g, "")).replace(/""/g, "string")}[];

export const EMBEDDED_LEDGER_TRANSACTIONS = ${JSON.stringify(transactions, null, 2)} as const;

export const EMBEDDED_LEDGER_HEADERS = [
  "date",
  "action",
  "assetTicker",
  "cryptoUrlName",
  "quantity",
  "price",
  "fiatFees",
  "currency",
  "platform",
  "assetClass",
  "sector",
  "country",
  "strategy",
  "notes",
  "totalAud",
  "totalFeesIncludedAud",
  "fiatFeesAud"
] as const;

export function embeddedLedgerToCsv() {
  const escape = (value: unknown) => {
    const text = String(value ?? "");
    return text.includes(",") || text.includes("\\n") || text.includes('"')
      ? '"' + text.replaceAll('"', '""') + '"'
      : text;
  };

  return [
    EMBEDDED_LEDGER_HEADERS.join(","),
    ...EMBEDDED_LEDGER_TRANSACTIONS.map((row) =>
      EMBEDDED_LEDGER_HEADERS.map((key) => escape(row[key])).join(",")
    ),
  ].join("\\n");
}
`;

fs.writeFileSync(output, code);
console.log(`Generated ${transactions.length} embedded transactions`);
