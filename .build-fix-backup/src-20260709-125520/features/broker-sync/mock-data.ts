import type { BrokerConnection } from "./types";

export const brokerConnections: BrokerConnection[] = [
  {
    id: "1",
    broker: "CommSec",
    accountName: "Main Portfolio",
    accountNumber: "****2481",
    lastSync: "2026-07-07 09:12",
    status: "Connected",
    trades: 318,
  },
  {
    id: "2",
    broker: "CommSec Pocket",
    accountName: "ETF Builder",
    accountNumber: "****9044",
    lastSync: "2026-07-07 09:08",
    status: "Connected",
    trades: 96,
  },
];
