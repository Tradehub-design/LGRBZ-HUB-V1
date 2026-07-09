"use client";

import { create } from "zustand";

type TransactionStore = {
  account: string;
  search: string;
  type: string;

  setAccount(account: string): void;
  setSearch(search: string): void;
  setType(type: string): void;
};

export const useTransactionStore =
  create<TransactionStore>((set) => ({
    account: "All Accounts",
    search: "",
    type: "All",

    setAccount: (account) => set({ account }),
    setSearch: (search) => set({ search }),
    setType: (type) => set({ type }),
  }));
