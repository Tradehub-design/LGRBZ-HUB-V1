"use client";

import { ProfessionalDashboardOverview } from "@/components/professional-overview/ProfessionalDashboardOverview";


import { DashboardLiveDividendPanel } from "@/components/market-data/DashboardLiveDividendPanel";


import { DashboardLivePortfolioPanel } from "@/components/market-data/DashboardLivePortfolioPanel";


import { useEffect, useMemo, useState } from "react";
import { loadTxLedger } from "@/lib/transactions/ledgerStorage";
import { calculateHoldingsFromLedger } from "@/lib/holdings/calculateHoldingsFromLedger";
import { usePortfolioStore } from "@/store/portfolioStore";



const openHoldings = (
  symbol?: string
) => {
  const normalisedSymbol =
    typeof symbol === "string"
      ? symbol.trim().toUpperCase()
      : "";

  const destination =
    normalisedSymbol
      ? `/holdings?symbol=${encodeURIComponent(
          normalisedSymbol
        )}`
      : "/holdings";

  if (
    typeof window !==
    "undefined"
  ) {
    window.location.assign(
      destination
    );
  }
};


export default function DashboardPage() {
  const storeTransactions = usePortfolioStore((state) => state.transactions);
  const [localTransactions, setLocalTransactions] = useState<any[]>([]);

  useEffect(() => {
    setLocalTransactions(loadTxLedger());
  }, []);

  const transactions = storeTransactions.length ? storeTransactions : localTransactions;

  const holdings = useMemo(() => calculateHoldingsFromLedger(transactions as any), [transactions]);
  

function money(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">

      <ProfessionalDashboardOverview holdings={openHoldings} />

      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
