"use client";

import { HoldingsCommandCentre } from "@/components/holdings-professional/HoldingsCommandCentre";


import { ProfessionalHoldingsOverview } from "@/components/professional-overview/ProfessionalHoldingsOverview";


import { useEffect, useMemo, useState } from "react";
import { loadTxLedger } from "@/lib/transactions/ledgerStorage";
import { calculateHoldingsFromLedger, type LedgerHolding } from "@/lib/holdings/calculateHoldingsFromLedger";
import { usePortfolioStore } from "@/store/portfolioStore";

export default function HoldingsPage() {
  const storeTransactions = usePortfolioStore((state) => state.transactions);
  const [localTransactions, setLocalTransactions] = useState<any[]>([]);

  useEffect(() => {
    setLocalTransactions(loadTxLedger());
  }, []);

  const transactions = storeTransactions.length ? storeTransactions : localTransactions;

  const holdings = useMemo<LedgerHolding[]>(() => {
    return calculateHoldingsFromLedger(transactions as any);
  }, [transactions]);

  const openHoldings = holdings.filter((holding) => holding.status === "Open");
  const closedHoldings = holdings.filter((holding) => holding.status === "Closed");

  const totals = useMemo(() => {
    const marketValueAud = openHoldings.reduce((sum, holding) => sum + holding.marketValueAud, 0);
    const costBaseAud = openHoldings.reduce((sum, holding) => sum + holding.costBaseAud, 0);
    const realisedPlAud = holdings.reduce((sum, holding) => sum + holding.realisedPlAud, 0);
    const unrealisedPlAud = openHoldings.reduce((sum, holding) => sum + holding.unrealisedPlAud, 0);

    return {
      marketValueAud,
      costBaseAud,
      realisedPlAud,
      unrealisedPlAud,
      totalPlAud: realisedPlAud + unrealisedPlAud,
      totalReturnPercent: costBaseAud ? ((realisedPlAud + unrealisedPlAud) / costBaseAud) * 100 : 0,
    };
  }, [holdings, openHoldings]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Holdings</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Portfolio Holdings</h1>
        <p className="mt-2 text-sm text-slate-400">
          Calculated directly from the transaction ledger.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Open Holdings" value={String(openHoldings.length)} />
        <Stat label="Market Value" value={money(totals.marketValueAud)} />
        <Stat label="Cost Base" value={money(totals.costBaseAud)} />
        <Stat label="Total P/L" value={`${money(totals.totalPlAud)} (${totals.totalReturnPercent.toFixed(2)}%)`} />
      </div>

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
        <h2 className="text-lg font-semibold text-white">Open Positions</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="px-3 py-2">Ticker</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Avg Cost</th>
                <th className="px-3 py-2">Market Price</th>
                <th className="px-3 py-2">Market Value</th>
                <th className="px-3 py-2">Cost Base</th>
                <th className="px-3 py-2">Unrealised P/L</th>
                <th className="px-3 py-2">Weight</th>
                <th className="px-3 py-2">Sector</th>
              </tr>
            </thead>
            <tbody>
              {openHoldings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-8 text-center text-slate-400">
                    No open holdings yet.
                  </td>
                </tr>
              ) : (
                openHoldings.map((holding) => (
                  <tr key={holding.id} className="border-t border-white/10 text-white">
                    <td className="px-3 py-2 font-semibold">{holding.ticker}</td>
                    <td className="px-3 py-2">{holding.quantity.toLocaleString()}</td>
                    <td className="px-3 py-2">{money(holding.averageCostAud)}</td>
                    <td className="px-3 py-2">{money(holding.marketPriceAud)}</td>
                    <td className="px-3 py-2">{money(holding.marketValueAud)}</td>
                    <td className="px-3 py-2">{money(holding.costBaseAud)}</td>
                    <td className={holding.unrealisedPlAud >= 0 ? "px-3 py-2 text-emerald-300" : "px-3 py-2 text-red-300"}>
                      {money(holding.unrealisedPlAud)} ({holding.unrealisedPlPercent.toFixed(2)}%)
                    </td>
                    <td className="px-3 py-2">{holding.portfolioWeightPercent.toFixed(2)}%</td>
                    <td className="px-3 py-2">{holding.sector}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
        <h2 className="text-lg font-semibold text-white">Closed Positions</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="px-3 py-2">Ticker</th>
                <th className="px-3 py-2">Realised P/L</th>
                <th className="px-3 py-2">Sector</th>
                <th className="px-3 py-2">Platform</th>
              </tr>
            </thead>
            <tbody>
              {closedHoldings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-slate-400">
                    No closed positions yet.
                  </td>
                </tr>
              ) : (
                closedHoldings.map((holding) => (
                  <tr key={holding.id} className="border-t border-white/10 text-white">
                    <td className="px-3 py-2 font-semibold">{holding.ticker}</td>
                    <td className={holding.realisedPlAud >= 0 ? "px-3 py-2 text-emerald-300" : "px-3 py-2 text-red-300"}>
                      {money(holding.realisedPlAud)}
                    </td>
                    <td className="px-3 py-2">{holding.sector}</td>
                    <td className="px-3 py-2">{holding.platform}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
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

      <HoldingsCommandCentre holdings={openHoldings} />



      <ProfessionalHoldingsOverview holdings={openHoldings} />

      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}
