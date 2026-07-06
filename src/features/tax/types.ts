export type TaxEventType = "Dividend" | "Capital Gain" | "Capital Loss" | "Fee";

export type TaxEvent = {
  id: string;
  date: string;
  type: TaxEventType;
  symbol: string;
  description: string;
  amount: number;
  taxYear: string;
};
