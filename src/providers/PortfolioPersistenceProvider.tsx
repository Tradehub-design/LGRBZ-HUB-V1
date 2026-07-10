"use client";

import { useEffect, useRef } from "react";
import { applyPortfolioTransactions } from "@/core/portfolio-v2/apply";
import { loadStoredTransactions } from "@/core/portfolio-v2/storage";

export default function PortfolioPersistenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const stored = loadStoredTransactions();

    if (stored.length > 0) {
      applyPortfolioTransactions(stored, "local-storage-v2");
    }
  }, []);

  return <>{children}</>;
}
