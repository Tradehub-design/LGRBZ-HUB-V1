"use client";

import { useEffect, useRef } from "react";
import { applyPortfolioTransactions } from "@/core/portfolio-v2/apply";
import { loadStoredTransactions, saveStoredTransactions } from "@/core/portfolio-v2/storage";
import { usePortfolioStore } from "@/store/portfolioStore";

function signature(transactions: unknown[]) {
  return JSON.stringify(
    transactions.map((tx: any) => ({
      id: tx.id,
      date: tx.date,
      action: tx.action,
      ticker: tx.ticker ?? tx.assetTicker,
      quantity: tx.quantity,
      price: tx.price,
      total: tx.total ?? tx.totalAud ?? tx.amountAud,
    })),
  );
}

export default function PortfolioPersistenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useRef(false);
  const lastSignature = useRef("");

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const stored = loadStoredTransactions();

    if (stored.length > 0) {
      lastSignature.current = signature(stored);
      applyPortfolioTransactions(stored, "local-storage-v2");
    }

    const unsubscribe = usePortfolioStore.subscribe((state) => {
      const tx = state.transactions ?? [];
      const nextSignature = signature(tx);

      if (nextSignature === lastSignature.current) return;

      lastSignature.current = nextSignature;
      saveStoredTransactions(tx as any);
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
