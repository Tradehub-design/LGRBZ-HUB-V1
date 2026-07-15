"use client";

import { ProfessionalDashboardOverview } from "@/components/professional-overview/ProfessionalDashboardOverview";


import { DashboardLiveDividendPanel } from "@/components/market-data/DashboardLiveDividendPanel";


import { DashboardLivePortfolioPanel } from "@/components/market-data/DashboardLivePortfolioPanel";


import { useEffect, useMemo, useState } from "react";
import { loadTxLedger } from "@/lib/transactions/ledgerStorage";
import { calculateHoldingsFromLedger } from "@/lib/holdings/calculateHoldingsFromLedger";
import { usePortfolioStore } from "@/store/portfolioStore";

export default function DashboardPage() {
  const storeTransactions = usePortfolioStore((state) => state.transactions);
  const [localTransactions, setLocalTransactions] = useState<any[]>([]);

  useEffect(() => {
    setLocalTransactions(loadTxLedger());
  }, []);

  const transactions = storeTransactions.length ? storeTransactions : localTransactions;

  const holdings = useMemo(() => calculateHoldingsFromLedger(transactions as any), [transactions]);
  const openHoldings = holdings.filter((holding) => holding.status === "Open");

  const totals = useMemo(() => {
    const marketValueAud = openHoldings.reduce((sum, holding) => sum + holding.marketValueAud, 0);
    const costBaseAud = openHoldings.reduce((sum, holding) => sum + holding.costBaseAud, 0);
    const realisedPlAud = holdings.reduce((sum, holding) => sum + holding.realisedPlAud, 0);
    const unrealisedPlAud = openHoldings.reduce((sum, holding) => sum + holding.unrealisedPlAud, 0);
    const totalReturnAud = realisedPlAud + unrealisedPlAud;
    const totalReturnPercent = costBaseAud ? (totalReturnAud / costBaseAud) * 100 : 0;

    return {
      marketValueAud,
      costBaseAud,
      realisedPlAud,
      unrealisedPlAud,
      totalReturnAud,
      totalReturnPercent,
    };
  }, [holdings, openHoldings]);

  const recentTransactions = [...transactions].slice(-8).reverse();
  const topHoldings = [...openHoldings]
    .sort((a, b) => b.marketValueAud - a.marketValueAud)
    .slice(0, 8);

  return (
    <div className="space-y-6 p-6">

      <DashboardLivePortfolioPanel holdings={openHoldings} />

      <DashboardLiveDividendPanel holdings={openHoldings} />

      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Portfolio Summary</h1>
        <p className="mt-2 text-sm text-slate-400">
          Summary calculated from the transaction ledger.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Stat label="Portfolio Value" value={money(totals.marketValueAud)} />
        <Stat label="Cost Base" value={money(totals.costBaseAud)} />
        <Stat label="Total P/L" value={`${money(totals.totalReturnAud)} (${totals.totalReturnPercent.toFixed(2)}%)`} />
        <Stat label="Transactions" value={transactions.length.toLocaleString()} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
          <h2 className="text-lg font-semibold text-white">Top Holdings</h2>

          <div className="mt-4 space-y-3">
            {topHoldings.length === 0 ? (
              <p className="text-sm text-slate-400">No holdings yet.</p>
            ) : (
              topHoldings.map((holding) => (
                <div key={holding.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{holding.ticker}</p>
                      <p className="text-xs text-slate-400">{holding.sector}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{money(holding.marketValueAud)}</p>
                      <p className="text-xs text-slate-400">{holding.portfolioWeightPercent.toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
          <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>

          <div className="mt-4 space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-slate-400">No transactions yet.</p>
            ) : (
              recentTransactions.map((tx: any) => (
                <div key={tx.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{tx.ticker ?? tx.assetTicker}</p>
                      <p className="text-xs text-slate-400">{tx.date} · {tx.action}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{money(Number(tx.totalAud ?? tx.total ?? 0))}</p>
                      <p className="text-xs text-slate-400">{tx.platform}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

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
