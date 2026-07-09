"use client";

import { useEffect, useState } from "react";
import {
  listPortfolioTransactions,
  type DbPortfolioTransaction,
} from "@/lib/supabase/transactionRepository";

export function useDbTransactions(portfolioId: string | null) {
  const [transactions, setTransactions] = useState<DbPortfolioTransaction[]>([]);
  const [loading, setLoading] = useState(Boolean(portfolioId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!portfolioId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    listPortfolioTransactions(portfolioId)
      .then(setTransactions)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load transactions."))
      .finally(() => setLoading(false));
  }, [portfolioId]);

  return { transactions, loading, error };
}
