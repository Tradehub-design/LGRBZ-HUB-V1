#!/usr/bin/env bash
set -e

echo "🔧 Fixing AI workspace store..."

cat > src/store/ai/workspaceStore.ts <<'TS'
import { create } from "zustand";

export type AIWorkspaceItem = {
  id: string;
  title: string;
  detail: string;
  status?: "active" | "idle" | "complete";
};

export type AIWorkspaceState = {
  workspace: AIWorkspaceItem[];
  setWorkspace: (workspace: AIWorkspaceItem[]) => void;
  clearWorkspace: () => void;
};

export const useAIWorkspaceStore = create<AIWorkspaceState>((set) => ({
  workspace: [
    {
      id: "portfolio-review",
      title: "Portfolio Review",
      detail: "Review portfolio allocation, income, risk and recent activity.",
      status: "active",
    },
  ],

  setWorkspace: (workspace) => set({ workspace }),

  clearWorkspace: () => set({ workspace: [] }),
}));
TS

npm run build
