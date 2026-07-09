"use client";

import { create } from "zustand";
import type { AnalyticsRange } from "./types";

type AnalyticsStore = {
  range: AnalyticsRange;
  setRange: (range: AnalyticsRange) => void;
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  range: "YTD",
  setRange: (range) => set({ range }),
}));
