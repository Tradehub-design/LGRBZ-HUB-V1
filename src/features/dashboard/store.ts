"use client";

import { create } from "zustand";
import type { DashboardRange, DashboardState } from "./types";

export const useDashboardStore = create<DashboardState>((set) => ({
  range: "30D",
  setRange: (range: DashboardRange) => set({ range }),
}));
