"use client";

import { useEffect, useState } from "react";
import { marketProvider, type MarketQuote } from "@/lib/market/provider";

export function useMarketQuotes(symbols: string[]) {

  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    let mounted = true;

    marketProvider
      .getQuotes(symbols)
      .then((rows) => {
        if (mounted) setQuotes(rows);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };

  }, [symbols.join(",")]);

  return {
    loading,
    quotes,
  };

}
