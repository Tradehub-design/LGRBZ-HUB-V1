export type TransactionType =
  | "Buy"
  | "Sell"
  | "Dividend"
  | "Deposit"
  | "Withdrawal"
  | "Fee"
  | "Transfer";

export interface Transaction {
  id: string;
  date: string;
  account: string;
  broker: string;
  symbol: string;
  company: string;
  type: TransactionType;
  quantity: number;
  price: number;
  fees: number;
  total: number;
  currency: string;
  notes?: string;
}
