import { create } from "zustand";

export type DashboardSummary = {
  headline: string;
  totalValueAud: number;
  totalReturnAud: number;
  totalReturnPercent: number;
};

export const useDashboardSummaryStore = create<{
  summary: DashboardSummary;
  setSummary: (summary: Partial<DashboardSummary> & Record<string, unknown>) => void;
}>((set) => ({
  summary: {
    headline: "Dashboard ready",
    totalValueAud: 0,
    totalReturnAud: 0,
    totalReturnPercent: 0,
  },
  setSummary: (summary) =>
    set((state) => ({
      summary: {
        ...state.summary,
        ...summary,
      },
    })),
}));
