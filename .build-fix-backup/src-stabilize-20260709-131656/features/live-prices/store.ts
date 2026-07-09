"use client";

import { create } from "zustand";

type LivePricesStore = {
  search: string;
  exchange: string;
  setSearch: (search: string) => void;
  setExchange: (exchange: string) => void;
};

export const useLivePricesStore = create<LivePricesStore>((set) => ({
  search: "",
  exchange: "All",
  setSearch: (search) => set({ search }),
  setExchange: (exchange) => set({ exchange }),
}));
