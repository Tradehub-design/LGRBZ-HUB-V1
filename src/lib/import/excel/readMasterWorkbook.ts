import * as XLSX from "xlsx";

import { inspectWorkbook } from "../mapping/inspectWorkbook";
import { MasterTransactionRow } from "../types/masterWorkbook";

export interface MasterWorkbookImportResult {
  sheetNames: string[];
  detectedHeaders: Record<string,string>;
  transactions: MasterTransactionRow[];
}

function normaliseHeader(value: unknown): string {
  return String(value ?? "").trim();
}

function normaliseRow(row: Record<string, unknown>): MasterTransactionRow {
  return {
    Date: String(row.Date ?? ""),
    Action: String(row.Action ?? ""),
    "Asset Ticker": String(row["Asset Ticker"] ?? ""),
    "Crypto URL Name": String(row["Crypto URL Name"] ?? ""),
    Quantity: Number(row.Quantity ?? 0),
    Price: Number(row.Price ?? 0),
    "Fiat Fees": Number(row["Fiat Fees"] ?? 0),
    Currency: String(row.Currency ?? "AUD"),
    Platform: String(row.Platform ?? ""),
    "Asset Class": String(row["Asset Class"] ?? ""),
    Sector: String(row.Sector ?? ""),
    Country: String(row.Country ?? ""),
    Strategy: String(row.Strategy ?? ""),
    Notes: String(row.Notes ?? ""),
    Total: Number(row.Total ?? 0),
  };
}

export async function readMasterWorkbook(
  file: File,
): Promise<MasterWorkbookImportResult> {

  const buffer=await file.arrayBuffer();

  const workbook=XLSX.read(buffer,{
    type:"array",
    cellDates:true,
  });

  const transactionsSheetName=
    workbook.SheetNames.find(
      x=>x.trim().toLowerCase()==="transactions",
    ) ??
    workbook.SheetNames.find(
      x=>x.trim().toLowerCase().includes("transaction"),
    );

  if(!transactionsSheetName){
    throw new Error("Could not find Transactions worksheet.");
  }

  const worksheet=workbook.Sheets[transactionsSheetName];

  const rows=XLSX.utils.sheet_to_json<Record<string,unknown>>(
      worksheet,
      {
          defval:"",
          raw:false,
      },
  );

  const detectedHeaders=inspectWorkbook(rows);

  const transactions=rows
      .map(r=>{

          const cleaned:Record<string,unknown>={};

          for(const [k,v] of Object.entries(r)){
              cleaned[normaliseHeader(k)]=v;
          }

          return normaliseRow(cleaned);

      })
      .filter(
        r=>r.Date||r.Action||r["Asset Ticker"],
      );

  return{

      sheetNames:workbook.SheetNames,

      detectedHeaders,

      transactions,

  };

}
