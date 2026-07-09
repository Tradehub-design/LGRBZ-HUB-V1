#!/usr/bin/env bash
set -e

echo "🔧 Expanding AI workspace shape..."

cat > src/store/ai/workspaceStore.ts <<'TS'
import { create } from "zustand";

export type AIWorkspace = {
  confidence: number;
  status: string;
  summary: string;
  portfolioValue: number;
  riskScore: number;
  incomeForecast: number;
  alerts: number;
  recommendations: {
    id: string;
    title: string;
    detail: string;
  }[];
};

export type AIWorkspaceState = {
  workspace: AIWorkspace;
  setWorkspace: (workspace: AIWorkspace) => void;
  clearWorkspace: () => void;
};

const defaultWorkspace: AIWorkspace = {
  confidence: 87,
  status: "Active",
  summary: "AI workspace is ready for portfolio review.",
  portfolioValue: 0,
  riskScore: 0,
  incomeForecast: 0,
  alerts: 0,
  recommendations: [
    {
      id: "portfolio-review",
      title: "Portfolio Review",
      detail: "Review allocation, income, risk and recent activity.",
    },
  ],
};

export const useAIWorkspaceStore = create<AIWorkspaceState>((set) => ({
  workspace: defaultWorkspace,
  setWorkspace: (workspace) => set({ workspace }),
  clearWorkspace: () => set({ workspace: defaultWorkspace }),
}));
TS

npm run build
