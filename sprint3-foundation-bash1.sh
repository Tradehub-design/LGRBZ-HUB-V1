#!/usr/bin/env bash
set -e

echo "🔧 Sprint 3 Bash 1: dashboard shell + import engine + persistence..."

mkdir -p src/lib/portfolio src/providers 'src/app/(dashboard)'

cat > src/lib/portfolio/buildEngineFromTransactions.ts <<'TS'
import type {
  AllocationSlice,
  CurrencyCode,
  LedgerRow,
  PortfolioCashAccount,
  PortfolioDividend,
  PortfolioEngine,
  PortfolioHolding,
} from "@/store/portfolioStore";

function n(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function keyBy(items: AllocationSlice[], key: string, value: number) {
  const existing = items.find((item) => item.label === key);
  if (existing) {
    existing.value += value;
  } else {
    items.push({ label: key, value, percent: 0 });
  }
}

function finalize(items: AllocationSlice[], total: number) {
  return items.map((item) => ({
    ...item,
    percent: total ? (item.value / total) * 100 : 0,
  }));
}

export function buildEngineFromTransactions(transactions: LedgerRow[]): PortfolioEngine {
  const holdingsMap = new Map<string, PortfolioHolding>();
  const dividends: PortfolioDividend[] = [];
  let cashBalance = 0;
  let depositsAud = 0;
  let withdrawalsAud = 0;
  let feesAud = 0;
  let realisedPlAud = 0;

  for (const tx of transactions) {
    const action = String(tx.action ?? "").toLowerCase();
    const ticker = String(tx.ticker ?? tx.assetTicker ?? "CASH").toUpperCase();
    const quantity = n(tx.quantity);
    const price = n(tx.priceAud ?? tx.price);
    const fees = n(tx.feesAud ?? tx.fiatFees ?? tx.fees);
    const total = n(tx.totalAud ?? tx.total ?? tx.amountAud ?? tx.amount ?? quantity * price + fees);

    feesAud += fees;

    if (action.includes("deposit")) {
      cashBalance += total;
      depositsAud += total;
      continue;
    }

    if (action.includes("withdraw")) {
      cashBalance -= total;
      withdrawalsAud += total;
      continue;
    }

    if (action.includes("dividend")) {
      cashBalance += total;
      dividends.push({
        id: `div-${tx.id}`,
        date: tx.date,
        amount: total,
        amountAud: total,
        ticker,
        assetTicker: ticker,
        platform: tx.platform ?? "Manual",
        currency: (tx.currency ?? "AUD") as CurrencyCode,
        sector: tx.sector ?? "Uncategorised",
        country: tx.country ?? "Australia",
        notes: tx.notes ?? "",
      });
      continue;
    }

    const existing = holdingsMap.get(ticker);

    const base: PortfolioHolding =
      existing ??
      {
        id: ticker,
        ticker,
        assetTicker: ticker,
        name: ticker,
        platform: tx.platform ?? "Manual",
        assetClass: tx.assetClass ?? "Equity",
        sector: tx.sector ?? "Uncategorised",
        country: tx.country ?? "Australia",
        currency: (tx.currency ?? "AUD") as CurrencyCode,
        status: "Open",
        quantity: 0,
        averagePriceAud: 0,
        priceAud: price,
        marketPriceAud: price,
        valueAud: 0,
        marketValueAud: 0,
        costBaseAud: 0,
        realisedPlAud: 0,
        unrealisedPlAud: 0,
        unrealisedPlPercent: 0,
        weightPercent: 0,
        portfolioWeightPercent: 0,
        company: ticker,
        exchange: "",
        industry: tx.sector ?? "Uncategorised",
        strategy: tx.strategy ?? "Manual",
        risk: "Medium",
        totalCostAud: 0,
        averageCostAud: 0,
        dividendsAud: 0,
        lots: [],
        metrics: {
          marketPrice: price,
          marketValue: 0,
          unrealisedProfit: 0,
          unrealisedPercent: 0,
          averageCost: 0,
          costBasis: 0,
          realisedProfit: 0,
          totalProfit: 0,
          totalReturnPercent: 0,
          allocationPercent: 0,
          dividendYield: 0,
          yieldOnCost: 0,
        },
      };

    if (action.includes("buy")) {
      base.quantity += quantity;
      base.costBaseAud += total;
      cashBalance -= total;
    } else if (action.includes("sell")) {
      const avgCost = base.quantity ? base.costBaseAud / base.quantity : 0;
      const costRemoved = avgCost * quantity;
      base.quantity -= quantity;
      base.costBaseAud -= costRemoved;
      const realised = total - costRemoved - fees;
      base.realisedPlAud += realised;
      realisedPlAud += realised;
      cashBalance += total;
    }

    if (base.quantity <= 0.000001) {
      base.status = "Closed";
      base.quantity = Math.max(base.quantity, 0);
    }

    base.averagePriceAud = base.quantity ? base.costBaseAud / base.quantity : 0;
    base.averageCostAud = base.averagePriceAud;
    base.priceAud = price || base.priceAud;
    base.marketPriceAud = base.priceAud;
    base.valueAud = base.quantity * base.marketPriceAud;
    base.marketValueAud = base.valueAud;
    base.totalCostAud = base.costBaseAud;
    base.unrealisedPlAud = base.valueAud - base.costBaseAud;
    base.unrealisedPlPercent = base.costBaseAud ? (base.unrealisedPlAud / base.costBaseAud) * 100 : 0;
    base.metrics = {
      ...base.metrics,
      marketPrice: base.marketPriceAud,
      marketValue: base.marketValueAud,
      unrealisedProfit: base.unrealisedPlAud,
      unrealisedPercent: base.unrealisedPlPercent,
      averageCost: base.averageCostAud,
      costBasis: base.costBaseAud,
      realisedProfit: base.realisedPlAud,
      totalProfit: base.realisedPlAud + base.unrealisedPlAud,
      totalReturnPercent: base.unrealisedPlPercent,
    };

    holdingsMap.set(ticker, base);
  }

  const holdings = Array.from(holdingsMap.values());
  const totalValueAud = holdings.reduce((sum, holding) => sum + holding.valueAud, 0);
  const totalCostAud = holdings.reduce((sum, holding) => sum + holding.costBaseAud, 0);

  for (const holding of holdings) {
    holding.weightPercent = totalValueAud ? (holding.valueAud / totalValueAud) * 100 : 0;
    holding.portfolioWeightPercent = holding.weightPercent;
    holding.metrics.allocationPercent = holding.weightPercent;
  }

  const openHoldings = holdings.filter((holding) => holding.status !== "Closed");
  const closedHoldings = holdings.filter((holding) => holding.status === "Closed");

  const assetClass: AllocationSlice[] = [];
  const sector: AllocationSlice[] = [];
  const country: AllocationSlice[] = [];
  const currency: AllocationSlice[] = [];
  const platform: AllocationSlice[] = [];
  const risk: AllocationSlice[] = [];

  for (const holding of openHoldings) {
    keyBy(assetClass, holding.assetClass, holding.valueAud);
    keyBy(sector, holding.sector, holding.valueAud);
    keyBy(country, holding.country, holding.valueAud);
    keyBy(currency, holding.currency, holding.valueAud);
    keyBy(platform, holding.platform, holding.valueAud);
    keyBy(risk, holding.risk, holding.valueAud);
  }

  const cash: PortfolioCashAccount = {
    id: "cash",
    name: "Cash",
    platform: "Manual",
    currency: "AUD",
    balance: cashBalance,
    balanceAud: cashBalance,
    totalCash: cashBalance,
    totalDeposits: depositsAud,
    totalWithdrawals: withdrawalsAud,
    totalDividends: dividends.reduce((sum, item) => sum + item.amountAud, 0),
    totalInterest: 0,
    depositsAud,
    withdrawalsAud,
    dividendsAud: dividends.reduce((sum, item) => sum + item.amountAud, 0),
    interestAud: 0,
    feesAud,
  };

  const totalReturnAud = totalValueAud - totalCostAud + realisedPlAud;

  return {
    portfolio: {
      generatedAt: new Date().toISOString(),
      transactions,
      holdings,
      realisedTrades: [],
      cash: [cash],
      dividends,
      dashboard: {},
      replay: {},
      timeline: [
        {
          date: new Date().toISOString().slice(0, 10),
          portfolioValue: totalValueAud,
          valueAud: totalValueAud,
          investedAud: totalCostAud,
          cumulativeCashFlowAud: totalCostAud,
          profit: totalReturnAud,
        },
      ],
      performance: {
        realisedPnL: realisedPlAud,
        realisedPlAud,
        winRate: 0,
        totalReturnAud,
        totalReturnPercent: totalCostAud ? (totalReturnAud / totalCostAud) * 100 : 0,
        allTime: totalValueAud,
      },
    },
    transactions,
    holdings,
    openHoldings,
    closedHoldings,
    dividends,
    cashAccounts: [cash],
    allocation: {
      assetClass: finalize(assetClass, totalValueAud),
      sector: finalize(sector, totalValueAud),
      country: finalize(country, totalValueAud),
      currency: finalize(currency, totalValueAud),
      platform: finalize(platform, totalValueAud),
      account: finalize(platform, totalValueAud),
      risk: finalize(risk, totalValueAud),
    },
    summary: {
      totalCostAud,
      feesAud,
      realisedPlAud,
    },
    validRows: transactions.length,
    sourceRows: transactions.length,
    invalidRows: [],
    warnings: [],
  };
}
TS

cat > src/lib/import/store/importIntoPortfolio.ts <<'TS'
import { usePortfolioStore } from "@/store/portfolioStore";
import { importMasterWorkbook } from "@/lib/import/services/importMasterWorkbook";
import { buildEngineFromTransactions } from "@/lib/portfolio/buildEngineFromTransactions";

export async function importIntoPortfolio(file: File, options?: { apply?: boolean }) {
  const result = await importMasterWorkbook(file);
  const shouldApply = options?.apply ?? true;

  if (!shouldApply) {
    return {
      ...result,
      applied: false,
      applyMethod: "preview-only",
    };
  }

  const engine = buildEngineFromTransactions(result.transactions as any);
  const store = usePortfolioStore.getState();

  store.setEngine(engine, "master-workbook-import");

  if (typeof window !== "undefined") {
    window.localStorage.setItem("lgrbz.masterTransactions.v1", JSON.stringify(result.transactions));
  }

  return {
    ...result,
    applied: true,
    applyMethod: "setEngine",
  };
}
TS

cat > src/providers/PortfolioPersistenceProvider.tsx <<'TSX'
"use client";

import { useEffect, useRef } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { buildEngineFromTransactions } from "@/lib/portfolio/buildEngineFromTransactions";

const STORAGE_KEY = "lgrbz.masterTransactions.v1";

export default function PortfolioPersistenceProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const transactions = JSON.parse(saved);
      if (Array.isArray(transactions)) {
        usePortfolioStore.getState().setEngine(buildEngineFromTransactions(transactions), "local-storage");
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }

    const unsubscribe = usePortfolioStore.subscribe((state) => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions ?? []));
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}
TSX

cat > 'src/app/(dashboard)/layout.tsx' <<'TSX'
"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import PortfolioPersistenceProvider from "@/providers/PortfolioPersistenceProvider";
import { useSettingsStore } from "@/store/settingsStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useSettingsStore((state) => state.sidebarCollapsed);

  return (
    <PortfolioPersistenceProvider>
      <div className="min-h-screen bg-[#061421] text-white">
        <Sidebar />

        <main
          className={
            collapsed
              ? "min-h-screen px-4 py-6 transition-all duration-300 lg:pl-[108px] lg:pr-6"
              : "min-h-screen px-4 py-6 transition-all duration-300 lg:pl-[288px] lg:pr-6"
          }
        >
          <div className="mx-auto w-full max-w-[1800px]">
            {children}
          </div>
        </main>
      </div>
    </PortfolioPersistenceProvider>
  );
}
TSX

npm run build
