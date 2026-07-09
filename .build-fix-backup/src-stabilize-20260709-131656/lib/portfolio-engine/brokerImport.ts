export type BrokerSource = {
  id: string;
  name: string;
  type: "Shares" | "Crypto" | "Cash" | "Mixed";
  status: "Ready" | "Planned" | "Manual";
  supportedFormats: string[];
};

export const BROKER_SOURCES: BrokerSource[] = [
  { id: "commsec", name: "CommSec", type: "Shares", status: "Ready", supportedFormats: ["CSV"] },
  { id: "commsec-international", name: "CommSec International", type: "Shares", status: "Ready", supportedFormats: ["CSV"] },
  { id: "stake", name: "Stake", type: "Shares", status: "Planned", supportedFormats: ["CSV"] },
  { id: "cmc", name: "CMC Markets", type: "Shares", status: "Planned", supportedFormats: ["CSV"] },
  { id: "coinbase", name: "Coinbase", type: "Crypto", status: "Manual", supportedFormats: ["CSV"] },
  { id: "binance", name: "Binance", type: "Crypto", status: "Planned", supportedFormats: ["CSV"] }
];

export function getBrokerImportSummary() {
  const ready = BROKER_SOURCES.filter((source) => source.status === "Ready").length;
  const planned = BROKER_SOURCES.filter((source) => source.status === "Planned").length;
  const manual = BROKER_SOURCES.filter((source) => source.status === "Manual").length;

  return {
    total: BROKER_SOURCES.length,
    ready,
    planned,
    manual,
  };
}
