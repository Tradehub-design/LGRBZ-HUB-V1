#!/usr/bin/env bash
set -e

echo "🔧 Fixing portfolio persistence infinite loop..."

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
  const syncing = useRef(false);
  const lastSignature = useRef("");

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const transactions = JSON.parse(saved);

        if (Array.isArray(transactions) && transactions.length > 0) {
          syncing.current = true;
          lastSignature.current = signature(transactions);
          usePortfolioStore.getState().setEngine(
            buildEngineFromTransactions(transactions),
            "local-storage",
          );
          syncing.current = false;
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        syncing.current = false;
      }
    }

    const unsubscribe = usePortfolioStore.subscribe((state) => {
      if (syncing.current) return;

      const transactions = state.transactions ?? [];
      const nextSignature = signature(transactions);

      if (nextSignature === lastSignature.current) return;

      lastSignature.current = nextSignature;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
TSX

npm run build
