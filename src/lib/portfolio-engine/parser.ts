import Papa from "papaparse";
import type { LedgerIssue, LedgerRow } from "./types";
import { parseLedgerDate } from "./date";
import {
  cleanCell,
  getCell,
  normaliseAction,
  normaliseAssetClass,
  normaliseCurrency,
  normaliseNumber,
  normaliseRisk,
  normaliseTicker,
} from "./normalise";

type ParseLedgerResult = {
  rows: LedgerRow[];
  issues: LedgerIssue[];
};

export function parseMasterLedger(input: string): ParseLedgerResult {
  const parsed = Papa.parse<Record<string, string>>(input, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => cleanCell(header),
  });

  const issues: LedgerIssue[] = [];

  if (parsed.errors.length > 0) {
    parsed.errors.forEach((error) => {
      issues.push({
        rowNumber: error.row ?? 0,
        severity: "error",
        field: "CSV",
        message: error.message,
      });
    });
  }

  const rows: LedgerRow[] = [];

  parsed.data.forEach((rawRow, index) => {
    const rowNumber = index + 2;

    const dateRaw = getCell(rawRow, ["Date"]);
    const date = parseLedgerDate(dateRaw);

    if (!date) {
      issues.push({
        rowNumber,
        severity: "error",
        field: "Date",
        message: "Could not parse transaction date.",
        value: dateRaw,
      });
      return;
    }

    const action = normaliseAction(getCell(rawRow, ["Action"]));
    const assetTicker = normaliseTicker(getCell(rawRow, ["Asset Ticker"]));
    const currency = normaliseCurrency(getCell(rawRow, ["Currency"]));
    const assetClass = normaliseAssetClass(getCell(rawRow, ["Asset Class"]));
    const strategyRaw = cleanCell(getCell(rawRow, ["Strategy"]));

    const quantity = normaliseNumber(getCell(rawRow, ["Quantity"]));
    const price = normaliseNumber(getCell(rawRow, ["Price"]));
    const fiatFees = normaliseNumber(getCell(rawRow, ["Fiat Fees", "Fiat Fees (AUD)"]));

    const total =
      normaliseNumber(getCell(rawRow, ["Total"])) ||
      inferTotal(action, quantity, price, fiatFees, false);

    const totalFeesIncluded =
      normaliseNumber(getCell(rawRow, ["Total\n(Fees Included)", "Total (Fees Included)"])) ||
      inferTotal(action, quantity, price, fiatFees, true);

    const totalAud =
      normaliseNumber(getCell(rawRow, ["Total (AUD)"])) ||
      normaliseNumber(getCell(rawRow, ["Total"]));

    const totalFeesIncludedAud =
      normaliseNumber(
        getCell(rawRow, [
          "Total \n(Fees Included) (AUD)",
          "Total (Fees Included) (AUD)",
          "Total Fees Included AUD",
        ]),
      ) ||
      totalAud ||
      totalFeesIncluded;

    rows.push({
      raw: rawRow,
      rowNumber,
      id: createLedgerId(rowNumber, date, action, assetTicker, getCell(rawRow, ["Platform"])),
      date,
      action,
      assetTicker,
      cryptoUrlName: cleanCell(getCell(rawRow, ["Crypto URL Name"])),
      quantity,
      price,
      fiatFees,
      currency,
      platform: cleanCell(getCell(rawRow, ["Platform"])) || "Unknown",
      assetClass,
      sector: cleanCell(getCell(rawRow, ["Sector"])) || "Others",
      country: cleanCell(getCell(rawRow, ["Country"])) || "Unknown",
      strategy: strategyRaw || normaliseRisk(strategyRaw),
      notes: cleanCell(getCell(rawRow, ["Notes"])),
      total,
      totalFeesIncluded,
      totalAud,
      totalFeesIncludedAud,
    });
  });

  return {
    rows,
    issues,
  };
}

function createLedgerId(
  rowNumber: number,
  date: string,
  action: string,
  ticker: string,
  platform: string,
) {
  return `${rowNumber}-${date}-${action}-${ticker}-${platform}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function inferTotal(
  action: string,
  quantity: number,
  price: number,
  fees: number,
  feesIncluded: boolean,
) {
  if (action.includes("Cash")) return price;
  const base = quantity * price;
  if (!Number.isFinite(base)) return 0;
  return feesIncluded ? base + fees : base;
}
