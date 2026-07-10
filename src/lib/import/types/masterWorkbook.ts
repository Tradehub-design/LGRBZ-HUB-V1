export interface MasterTransactionRow {
  Date: string;

  Action: string;

  "Asset Ticker": string;

  "Crypto URL Name"?: string;

  Quantity: number;

  Price: number;

  "Fiat Fees": number;

  Currency: string;

  Platform: string;

  "Asset Class": string;

  Sector: string;

  Country: string;

  Strategy: string;

  Notes: string;

  Total: number;
}
