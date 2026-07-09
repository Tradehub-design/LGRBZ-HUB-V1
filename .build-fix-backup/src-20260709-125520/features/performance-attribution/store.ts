"use client";

import { create } from "zustand";
import type { AttributionPeriod } from "./types";

type AttributionStore = {
  period: AttributionPeriod;
  setPeriod: (period: AttributionPeriod) => void;
};

export const useAttributionStore = create<AttributionStore>((set) => ({
  period: "YTD",
  setPeriod: (period) => set({ period }),
}));
