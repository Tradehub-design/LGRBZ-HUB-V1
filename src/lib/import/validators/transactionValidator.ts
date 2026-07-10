import { MasterTransactionRow } from "../types/masterWorkbook";

export function validateTransaction(row: MasterTransactionRow): string[] {
  const errors:string[]=[];

  if(!row.Date) errors.push("Missing Date");
  if(!row.Action) errors.push("Missing Action");
  if(!row["Asset Ticker"]) errors.push("Missing Asset Ticker");
  if(Number(row.Quantity)<=0) errors.push("Invalid Quantity");
  if(Number(row.Price)<0) errors.push("Invalid Price");
  if(!row.Platform) errors.push("Missing Platform");

  return errors;
}
