import { create } from "zustand";

export type AISummary = {
  headline: string;
  detail: string;
  score: number;
  forecast: {
    expectedReturn: number;
    expectedIncome: number;
    expectedValue: number;
    confidence: number;
    projectionYears: number;
    generated: string;
  };
  narrative: string;
};

const defaultSummary: AISummary = {
  headline: "Ready",
  detail: "AI summary is ready.",
  score: 0,
  forecast: {
    expectedReturn: 0,
    expectedIncome: 0,
    expectedValue: 0,
    confidence: 0,
    projectionYears: 0,
    generated: new Date().toISOString(),
  },
  narrative: "",
};

export const useAISummaryStore = create<{
  summary: AISummary;
  setSummary: (summary: Partial<AISummary>) => void;
}>((set) => ({
  summary: defaultSummary,
  setSummary: (summary) =>
    set((state) => ({
      summary: {
        ...state.summary,
        ...summary,
        forecast: {
          ...state.summary.forecast,
          ...(summary.forecast ?? {}),
        },
      },
    })),
}));
