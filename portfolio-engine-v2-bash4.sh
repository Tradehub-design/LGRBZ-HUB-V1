#!/usr/bin/env bash
set -e

echo "🔧 Portfolio Engine V2 Bash 4/5: manual add + hydration..."

cat > src/providers/PortfolioPersistenceProvider.tsx <<'TSX'
"use client";

import { useEffect, useRef } from "react";
import { applyPortfolioTransactions } from "@/core/portfolio-v2/apply";
import { loadStoredTransactions, saveStoredTransactions } from "@/core/portfolio-v2/storage";
import { usePortfolioStore } from "@/store/portfolioStore";

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

    const stored = loadStoredTransactions();

    if (stored.length > 0) {
      lastSignature.current = signature(stored);
      applyPortfolioTransactions(stored, "local-storage-v2");
    }

    const unsubscribe = usePortfolioStore.subscribe((state) => {
      const tx = state.transactions ?? [];
      const nextSignature = signature(tx);

      if (nextSignature === lastSignature.current) return;

      lastSignature.current = nextSignature;
      saveStoredTransactions(tx as any);
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
import { applyPortfolioTransactions } from "@/core/portfolio-v2/apply";
import type { CurrencyCode } from "@/core/portfolio-v2/types";
import { usePortfolioStore } from "@/store/portfolioStore";

const currencies: CurrencyCode[] = ["AUD", "USD", "GBP", "EUR", "NZD", "CAD", "JPY", "HKD", "SGD", "CHF", "CNY"];

export default function AddTransactionDialog() {
  const transactions = usePortfolioStore((state) => state.transactions);

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

    const nextTransaction = {
      id: `manual-${Date.now()}`,
      source: "manual",
      sourceRow: transactions.length + 1,
      date: form.date,
      action: form.action,
      ticker,
      assetTicker: ticker,
      quantity,
      price,
      fees,
      total,
      currency: form.currency,
      platform: form.platform,
      assetClass: form.assetClass,
      sector: form.sector,
      country: form.country,
      strategy: form.strategy,
      notes: form.notes,
      raw: { ...form },
    };

    applyPortfolioTransactions([...transactions, nextTransaction], "manual-transaction-v2");

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
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Add Transaction</h2>
          <p className="text-sm text-slate-400">
            Manual transactions added here update the portfolio immediately.
          </p>
        </div>

        <button
          type="button"
          onClick={confirmTransaction}
          className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 font-semibold text-slate-950 hover:bg-emerald-300"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Confirm Transaction
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Input label="Ticker" value={form.ticker} onChange={(value) => update("ticker", value)} placeholder="ASX:VAS" />
        <Select label="Action" value={form.action} onChange={(value) => update("action", value)} options={["Buy", "Sell", "Dividend", "Deposit", "Withdrawal", "Fee", "Interest", "Other"]} />
        <Input label="Date" type="date" value={form.date} onChange={(value) => update("date", value)} />
        <Input label="Quantity" type="number" value={form.quantity} onChange={(value) => update("quantity", value)} />
        <Input label="Price / Cost" type="number" value={form.price} onChange={(value) => update("price", value)} />
        <Input label="Fees" type="number" value={form.fees} onChange={(value) => update("fees", value)} />
        <Select label="Currency" value={form.currency} onChange={(value) => update("currency", value)} options={currencies} />
        <Input label="Platform" value={form.platform} onChange={(value) => update("platform", value)} />
        <Input label="Asset Class" value={form.assetClass} onChange={(value) => update("assetClass", value)} />
        <Input label="Sector" value={form.sector} onChange={(value) => update("sector", value)} />
        <Input label="Country" value={form.country} onChange={(value) => update("country", value)} />
        <Input label="Strategy" value={form.strategy} onChange={(value) => update("strategy", value)} />
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
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
TSX

npm run build
