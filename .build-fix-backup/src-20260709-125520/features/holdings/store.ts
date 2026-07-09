"use client";

import { create } from "zustand";

type HoldingsState = {
  accountId: string;
  search: string;
  setAccountId: (accountId: string) => void;
  setSearch: (search: string) => void;
};

export const useHoldingsStore = create<HoldingsState>((set) => ({
  accountId: "all",
  search: "",
  setAccountId: (accountId) => set({ accountId }),
  setSearch: (search) => set({ search }),
}));
