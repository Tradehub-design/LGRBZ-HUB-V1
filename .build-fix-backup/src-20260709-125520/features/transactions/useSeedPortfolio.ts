"use client";

import { useEffect } from "react";
import { embeddedLedgerToCsv } from "@/data/generated/embedded-ledger";
import { buildPortfolio } from "@/lib/portfolio-engine/buildPortfolio";
import { usePortfolioStore } from "@/store/portfolioStore";

export function useSeedPortfolio() {
  const loaded = usePortfolioStore((state) => state.loaded);
  const rawLedgerCsv = usePortfolioStore((state) => state.rawLedgerCsv);
  const setRawLedgerCsv = usePortfolioStore((state) => state.setRawLedgerCsv);
  const setEngine = usePortfolioStore((state) => state.setEngine);

  useEffect(() => {
    if (loaded && rawLedgerCsv?.trim()) return;

    const csv = embeddedLedgerToCsv();
    const result = buildPortfolio(csv);

    setRawLedgerCsv(csv);
    setEngine(result, csv);
  }, [loaded, rawLedgerCsv, setEngine, setRawLedgerCsv]);
}
