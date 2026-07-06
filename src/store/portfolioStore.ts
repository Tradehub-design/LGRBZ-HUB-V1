"use client";

import { create } from "zustand";
import type {
  LedgerRow,
  CalculatedHolding,
  CashAccount,
  DividendRecord,
  MemberContribution,
  PortfolioEngineResult,
} from "@/lib/portfolio-engine/types";

type PortfolioStore = {
  loaded: boolean;

  transactions: LedgerRow[];

  holdings: CalculatedHolding[];

  cashAccounts: CashAccount[];

  dividends: DividendRecord[];

  memberContributions: MemberContribution[];

  engine: PortfolioEngineResult | null;

  setEngine: (engine: PortfolioEngineResult) => void;

  clear: () => void;
};

export const usePortfolioStore =
  create<PortfolioStore>((set) => ({
    loaded: false,

    transactions: [],

    holdings: [],

    cashAccounts: [],

    dividends: [],

    memberContributions: [],

    engine: null,

    setEngine(engine) {
      set({
        loaded: true,

        engine,

        transactions: engine.transactions,

        holdings: engine.holdings,

        cashAccounts: engine.cashAccounts,

        dividends: engine.dividends,

        memberContributions:
          engine.memberContributions,
      });
    },

    clear() {
      set({
        loaded: false,

        transactions: [],

        holdings: [],

        cashAccounts: [],

        dividends: [],

        memberContributions: [],

        engine: null,
      });
    },
  }));
