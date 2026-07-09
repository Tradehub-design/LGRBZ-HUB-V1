import type { DividendRecord } from "./types";

export const dividendRecords: DividendRecord[] = [
  {
    id: "DIV001",
    date: "2026-03-20",
    symbol: "VAS",
    company: "Vanguard Australian Shares ETF",
    shares: 240,
    dividendPerShare: 1.68,
    grossAmount: 403.2,
    taxWithheld: 0,
    netAmount: 403.2,
    currency: "AUD",
    account: "Main Portfolio",
  },
  {
    id: "DIV002",
    date: "2026-05-12",
    symbol: "NAB",
    company: "National Australia Bank",
    shares: 180,
    dividendPerShare: 2.07,
    grossAmount: 372.6,
    taxWithheld: 0,
    netAmount: 372.6,
    currency: "AUD",
    account: "Main Portfolio",
  },
];
