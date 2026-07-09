"use client";

import { create } from "zustand";

type AccountsState = {
  accountId: string;
  setAccountId: (accountId: string) => void;
};

export const useAccountsStore = create<AccountsState>((set) => ({
  accountId: "all",
  setAccountId: (accountId) => set({ accountId }),
}));
