"use client";

import { useEffect } from "react";
import { buildPortfolio } from "@/lib/portfolio-engine/buildPortfolio";
import { usePortfolioStore } from "@/store/portfolioStore";

const SEEDED_LEDGER_URL = "/data/transactions.csv";

export function useSeedPortfolio() {
  const loaded = usePortfolioStore((state) => state.loaded);
  const setEngine = usePortfolioStore((state) => state.setEngine);

  useEffect(() => {
    if (loaded) return;

    let cancelled = false;

    async function loadSeedLedger() {
      try {
        const response = await fetch(SEEDED_LEDGER_URL, {
          cache: "no-store",
        });

        if (!response.ok) return;

        const csv = await response.text();

        if (cancelled || !csv.trim()) return;

        const engine = buildPortfolio(csv);
        setEngine(engine, csv);
      } catch {
        // Silent fail: manual import can still be used.
      }
    }

    loadSeedLedger();

    return () => {
      cancelled = true;
    };
  }, [loaded, setEngine]);
}
