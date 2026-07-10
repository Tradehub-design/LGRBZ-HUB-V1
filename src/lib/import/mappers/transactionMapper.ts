import { MasterTransactionRow } from "../types/masterWorkbook";

export function mapTransaction(row:MasterTransactionRow){

  return {

    date:row.Date,

    action:row.Action,

    assetTicker:row["Asset Ticker"],

    quantity:Number(row.Quantity),

    price:Number(row.Price),

    fees:Number(row["Fiat Fees"]||0),

    currency:row.Currency,

    platform:row.Platform,

    assetClass:row["Asset Class"],

    sector:row.Sector||"",

    country:row.Country||"",

    strategy:row.Strategy||"",

    notes:row.Notes||""

  };

}
