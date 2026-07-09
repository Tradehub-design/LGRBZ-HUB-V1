import { create } from "zustand";

export type MarketSnapshot = {
  symbol: string;
  price: number;
  changePercent?: number;
};

export const useMarketSnapshotStore = create<{
  snapshots: MarketSnapshot[];
  update: (snapshots: MarketSnapshot[]) => void;
}>((set) => ({
  snapshots: [],
  update: (snapshots) => set({ snapshots }),
}));
