"use client";

import { useEffect, useState } from "react";
import { listPortfolios, type DbPortfolio } from "@/lib/supabase/portfolioRepository";

export function useDbPortfolios() {
  const [portfolios, setPortfolios] = useState<DbPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPortfolios()
      .then(setPortfolios)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load portfolios."))
      .finally(() => setLoading(false));
  }, []);

  return { portfolios, loading, error };
}
