import type { TaxEvent } from "./types";

export const taxEvents: TaxEvent[] = [
  {
    id: "1",
    date: "2026-07-03",
    type: "Dividend",
    symbol: "VAS",
    description: "VAS dividend income",
    amount: 201.6,
    taxYear: "2026-2027",
  },
  {
    id: "2",
    date: "2026-06-27",
    type: "Capital Gain",
    symbol: "NAB",
    description: "Partial sale gain",
    amount: 840.2,
    taxYear: "2025-2026",
  },
  {
    id: "3",
    date: "2026-05-14",
    type: "Capital Loss",
    symbol: "LIFE360",
    description: "Realised capital loss",
    amount: -620.4,
    taxYear: "2025-2026",
  },
  {
    id: "4",
    date: "2026-04-02",
    type: "Fee",
    symbol: "COMMSEC",
    description: "Brokerage fee",
    amount: -19.9,
    taxYear: "2025-2026",
  },
];
