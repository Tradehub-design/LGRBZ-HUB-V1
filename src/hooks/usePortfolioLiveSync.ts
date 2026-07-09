"use client";

import { useEffect } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";

export default function usePortfolioLiveSync() {
  const holdings = usePortfolioStore((state) => state.holdings);
  const setHoldings = usePortfolioStore((state) => state.setHoldings);

  useEffect(() => {
    setHoldings(holdings);
  }, [holdings, setHoldings]);
}
