"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CashAccount,
  CalculatedHolding,
  DividendRecord,
  LedgerRow,
  MemberContribution,
  PortfolioEngineResult,
} from "@/lib/portfolio-engine/types";

type PortfolioStore = {
  loaded: boolean;
  lastUpdatedAt: string | null;
  rawLedgerCsv: string;
  transactions: LedgerRow[];
  holdings: CalculatedHolding[];
  cashAccounts: CashAccount[];
  dividends: DividendRecord[];
  memberContributions: MemberContribution[];
  engine: PortfolioEngineResult | null;
  setRawLedgerCsv: (csv: string) => void;
  setEngine: (engine: PortfolioEngineResult, csv?: string) => void;
  clear: () => void;
};

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      loaded: false,
      lastUpdatedAt: null,
      rawLedgerCsv: "",
      transactions: [],
      holdings: [],
      cashAccounts: [],
      dividends: [],
      memberContributions: [],
      engine: null,

      setRawLedgerCsv(csv) {
        set({ rawLedgerCsv: csv });
      },

      setEngine(engine, csv) {
        set({
          loaded: true,
          lastUpdatedAt: new Date().toISOString(),
          rawLedgerCsv: csv ?? "",
          engine,
          transactions: engine.transactions,
          holdings: engine.holdings,
          cashAccounts: engine.cashAccounts,
          dividends: engine.dividends,
          memberContributions: engine.memberContributions,
        });
      },

      clear() {
        set({
          loaded: false,
          lastUpdatedAt: null,
          rawLedgerCsv: "",
          transactions: [],
          holdings: [],
          cashAccounts: [],
          dividends: [],
          memberContributions: [],
          engine: null,
        });
      },
    }),
    {
      name: "lgrbz-portfolio-store-v1",
    },
  ),
);
