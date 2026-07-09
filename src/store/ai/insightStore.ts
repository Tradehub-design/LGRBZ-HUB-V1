import { create } from "zustand";

export type AIInsight = {
  id: string;
  title: string;
  detail?: string;
  category?: string;
};

type InsightState = {
  insights: AIInsight[];
  setInsights: (insights: AIInsight[]) => void;
};

export const useAIInsightStore = create<InsightState>((set) => ({
  insights: [],
  setInsights: (insights) => set({ insights }),
}));

export const useInsightStore = useAIInsightStore;
