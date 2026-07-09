import { create } from "zustand";

export type AIWorkspace = {
  confidence: number;
  status: string;
  summary: string;
  portfolioValue: number;
  riskScore: number;
  incomeForecast: number;
  alerts: number;
  allocation: { ticker: string; allocation: number; status: string }[];
  drawdowns: { ticker: string; drawdown: number }[];
  rebalance: { ticker: string; target: number; current: number }[];
  recommendations: { id: string; title: string; detail: string }[];
};

export const defaultWorkspace: AIWorkspace = {
  confidence: 87,
  status: "Active",
  summary: "AI workspace is ready.",
  portfolioValue: 0,
  riskScore: 0,
  incomeForecast: 0,
  alerts: 0,
  allocation: [],
  drawdowns: [],
  rebalance: [],
  recommendations: [],
};

export const useAIWorkspaceStore = create<{
  workspace: AIWorkspace;
  setWorkspace: (workspace: Partial<AIWorkspace>) => void;
  clearWorkspace: () => void;
}>((set) => ({
  workspace: defaultWorkspace,
  setWorkspace: (workspace) =>
    set((state) => ({ workspace: { ...state.workspace, ...workspace } })),
  clearWorkspace: () => set({ workspace: defaultWorkspace }),
}));
