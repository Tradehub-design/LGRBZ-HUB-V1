#!/usr/bin/env bash
set -e

echo "🔧 Fixing import loop + transaction confirm button..."

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

export default function PortfolioPersistenceProvider({ children }: { children: React.ReactNode }) {
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
          usePortfolioStore.getState().setEngine(buildEngineFromTransactions(transactions), "local-storage");
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

cat > src/components/transactions/AddTransactionDialog.tsx <<'TSX'
"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { usePortfolioStore, type CurrencyCode, type LedgerRow } from "@/store/portfolioStore";
import { buildEngineFromTransactions } from "@/lib/portfolio/buildEngineFromTransactions";

const currencies: CurrencyCode[] = ["AUD", "USD", "GBP", "EUR", "NZD", "CAD", "JPY", "HKD", "SGD", "CHF", "CNY"];

export default function AddTransactionDialog() {
  const transactions = usePortfolioStore((state) => state.transactions);
  const setEngine = usePortfolioStore((state) => state.setEngine);

  const [form, setForm] = useState({
    ticker: "",
    action: "Buy",
    date: new Date().toISOString().slice(0, 10),
    quantity: "",
    price: "",
    fees: "0",
    currency: "AUD" as CurrencyCode,
    platform: "Manual",
    assetClass: "Stock",
    sector: "Unknown",
    country: "Australia",
    strategy: "Manual",
    notes: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function confirmTransaction() {
    const ticker = form.ticker.trim().toUpperCase();
    if (!ticker) {
      alert("Please enter a ticker.");
      return;
    }

    const quantity = Number(form.quantity || 0);
    const price = Number(form.price || 0);
    const fees = Number(form.fees || 0);
    const total = quantity * price + fees;

    const tx: LedgerRow = {
      id: `manual-${Date.now()}`,
      raw: { ...form },
      rowNumber: transactions.length + 1,
      source: "manual",
      sourceRow: transactions.length + 1,
      date: form.date,
      action: form.action,
      type: form.action,
      assetTicker: ticker,
      ticker,
      platform: form.platform,
      currency: form.currency,
      quantity,
      price,
      priceAud: price,
      marketPriceAud: price,
      fiatFees: fees,
      fees,
      feesAud: fees,
      total,
      totalAud: total,
      totalFeesIncluded: total,
      totalFeesIncludedAud: total,
      amount: total,
      amountAud: total,
      assetClass: form.assetClass,
      sector: form.sector,
      country: form.country,
      strategy: form.strategy,
      notes: form.notes,
    };

    const nextTransactions = [...transactions, tx];
    setEngine(buildEngineFromTransactions(nextTransactions), "manual-transaction");

    setForm((current) => ({
      ...current,
      ticker: "",
      quantity: "",
      price: "",
      fees: "0",
      notes: "",
    }));
  }

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Add Transaction</h2>
          <p className="text-sm text-slate-400">Manual transactions added here update the portfolio immediately.</p>
        </div>

        <button
          type="button"
          onClick={confirmTransaction}
          className="inline-flex items-center rounded-xl bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Confirm Transaction
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Input label="Ticker" value={form.ticker} onChange={(v) => update("ticker", v)} placeholder="ASX:VAS" />

        <Select label="Action" value={form.action} onChange={(v) => update("action", v)} options={["Buy", "Sell", "Dividend", "Deposit", "Withdrawal"]} />

        <Input label="Date" type="date" value={form.date} onChange={(v) => update("date", v)} />

        <Input label="Quantity" type="number" value={form.quantity} onChange={(v) => update("quantity", v)} />

        <Input label="Price / Cost" type="number" value={form.price} onChange={(v) => update("price", v)} />

        <Input label="Fees" type="number" value={form.fees} onChange={(v) => update("fees", v)} />

        <Select label="Currency" value={form.currency} onChange={(v) => update("currency", v)} options={currencies} />

        <Input label="Platform" value={form.platform} onChange={(v) => update("platform", v)} />

        <Input label="Asset Class" value={form.assetClass} onChange={(v) => update("assetClass", v)} />

        <Input label="Sector" value={form.sector} onChange={(v) => update("sector", v)} />

        <Input label="Country" value={form.country} onChange={(v) => update("country", v)} />

        <Input label="Strategy" value={form.strategy} onChange={(v) => update("strategy", v)} />
      </div>

      <textarea
        value={form.notes}
        onChange={(event) => update("notes", event.target.value)}
        placeholder="Notes..."
        className="mt-3 min-h-[80px] w-full rounded-xl border border-cyan-500/20 bg-slate-900 px-3 py-2 text-white outline-none"
      />
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-cyan-500/20 bg-slate-900 px-3 py-2 text-white outline-none"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-cyan-500/20 bg-slate-900 px-3 py-2 text-white outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
TSX

npm run build
