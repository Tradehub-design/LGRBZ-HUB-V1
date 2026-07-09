export type BrokerStatus =
  | "Connected"
  | "Disconnected"
  | "Syncing"
  | "Error";

export interface BrokerConnection {
  id: string;
  broker: string;
  accountName: string;
  accountNumber: string;
  lastSync: string;
  status: BrokerStatus;
  trades: number;
}
