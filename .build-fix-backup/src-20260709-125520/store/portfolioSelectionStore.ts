"use client";

import { create } from "zustand";

type Store = {
  selectedPortfolioId: string | null;
  setSelectedPortfolioId: (id: string | null) => void;
};

export const usePortfolioSelectionStore = create<Store>((set) => ({
  selectedPortfolioId: null,
  setSelectedPortfolioId: (id) => set({ selectedPortfolioId: id }),
}));
