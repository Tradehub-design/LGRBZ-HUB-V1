import { MasterTransactionRow } from "../types/masterWorkbook";
import { toNumber } from "./number";

export function convertMasterTransactions(
  rows: MasterTransactionRow[],
) {

  return rows.map((row, index) => ({

    id: crypto.randomUUID(),

    source: "master-workbook",

    sourceRow: index + 2,

    rowNumber: index + 2,

    raw: row,

    date: row.Date,

    action: row.Action,

    type: row.Action,

    assetTicker: row["Asset Ticker"],

    ticker: row["Asset Ticker"],

    quantity: toNumber(row.Quantity),

    price: toNumber(row.Price),

    priceAud: toNumber(row.Price),

    fees: toNumber(row["Fiat Fees"]),

    currency: row.Currency || "AUD",

    platform: row.Platform,

    assetClass: row["Asset Class"],

    sector: row.Sector,

    country: row.Country,

    strategy: row.Strategy,

    notes: row.Notes,

    total: toNumber(row.Total),

    amount: toNumber(row.Total),

    marketPriceAud: 0,

    marketValueAud: 0,

    averageCostAud: toNumber(row.Price),

    unrealisedPlAud: 0,

    unrealisedPlPercent: 0,

    portfolioWeightPercent: 0,

  }));

}
