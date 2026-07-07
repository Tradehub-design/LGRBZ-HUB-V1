"use client";

import { useEffect } from "react";
import { buildSeedPortfolio } from "@/lib/portfolio-engine/seed";
import { usePortfolioStore } from "@/store/portfolioStore";
import { DEFAULT_TRANSACTION_LEDGER } from "@/data/seed-transactions";

export function useSeedPortfolio() {
  const loaded = usePortfolioStore((state) => state.loaded);
  const setEngine = usePortfolioStore((state) => state.setEngine);

  useEffect(() => {
    if (loaded) return;

    const seed = buildSeedPortfolio();

    if (seed) {
      setEngine(seed, DEFAULT_TRANSACTION_LEDGER);
    }
  }, [loaded, setEngine]);
}
