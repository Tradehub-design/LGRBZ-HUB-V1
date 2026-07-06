"use client";

import { create } from "zustand";

type WatchlistStore = {
  search: string;
  setSearch: (search: string) => void;
};

export const useWatchlistStore = create<WatchlistStore>((set) => ({
  search: "",
  setSearch: (search) => set({ search }),
}));
