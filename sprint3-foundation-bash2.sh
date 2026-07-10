#!/usr/bin/env bash
set -e

echo "🔧 Sprint 3 Bash 2: auto-sync manual transactions to portfolio engine..."

cat > src/providers/PortfolioPersistenceProvider.tsx <<'TSX'
"use client";

import { useEffect, useRef } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { buildEngineFromTransactions } from "@/lib/portfolio/buildEngineFromTransactions";

const STORAGE_KEY = "lgrbz.masterTransactions.v1";

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

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const transactions = JSON.parse(saved);

        if (Array.isArray(transactions) && transactions.length > 0) {
          lastSignature.current = signature(transactions);
          usePortfolioStore.getState().setEngine(
            buildEngineFromTransactions(transactions),
            "local-storage",
          );
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    const unsubscribe = usePortfolioStore.subscribe((state) => {
      const transactions = state.transactions ?? [];
      const nextSignature = signature(transactions);

      if (nextSignature === lastSignature.current) return;

      lastSignature.current = nextSignature;

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

      const rebuiltEngine = buildEngineFromTransactions(transactions as any);
      usePortfolioStore.getState().setEngine(rebuiltEngine, "transaction-sync");
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
TSX

npm run build
