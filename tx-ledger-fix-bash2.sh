#!/usr/bin/env bash
set -e

echo "🔧 Transaction Ledger Fix Bash 2/4: transactions page..."

cat > 'src/app/(dashboard)/transactions/page.tsx' <<'TSX'
"use client";

import { useMemo, useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { applyLedger } from "@/lib/transactions/applyLedger";
import { clearTxLedger } from "@/lib/transactions/ledgerStorage";
import { usePortfolioStore, type CurrencyCode } from "@/store/portfolioStore";

const currencies: CurrencyCode[] = ["AUD", "USD", "GBP", "EUR", "NZD", "CAD", "JPY", "HKD", "SGD", "CHF", "CNY"];

export default function TransactionsPage() {
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

  const totals = useMemo(() => {
    return {
      count: transactions.length,
      buyValue: transactions
        .filter((tx) => String(tx.action).toLowerCase().includes("buy"))
        .reduce((sum, tx) => sum + Number(tx.totalAud ?? tx.total ?? 0), 0),
      sellValue: transactions
        .filter((tx) => String(tx.action).toLowerCase().includes("sell"))
        .reduce((sum, tx) => sum + Number(tx.totalAud ?? tx.total ?? 0), 0),
    };
  }, [transactions]);

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
      rowNumber: transactions.length + 1,
      date: form.date,
      action: form.action,
      type: form.action,
      ticker,
      assetTicker: ticker,
      quantity,
      price,
      priceAud: price,
      marketPriceAud: price,
      fees,
      fiatFees: fees,
      feesAud: fees,
      total,
      totalAud: total,
      totalFeesIncluded: total,
      totalFeesIncludedAud: total,
      amount: total,
      amountAud: total,
      currency: form.currency,
      platform: form.platform,
      assetClass: form.assetClass,
      sector: form.sector,
      country: form.country,
      strategy: form.strategy,
      notes: form.notes,
      raw: { ...form },
    };

    applyLedger([...transactions, nextTransaction], "manual-transaction");

    setForm((current) => ({
      ...current,
      ticker: "",
      quantity: "",
      price: "",
      fees: "0",
      notes: "",
    }));
  }

  function removeTransaction(id: string) {
    if (!confirm("Delete this transaction?")) return;
    applyLedger(transactions.filter((tx) => tx.id !== id), "delete-transaction");
  }

  function clearAll() {
    if (!confirm("Clear all local transactions?")) return;
    clearTxLedger();
    applyLedger([], "clear-ledger");
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Transactions</p>
          <h1 className="mt-2 text-3xl font-bold text-white">Transaction Ledger</h1>
          <p className="mt-2 text-sm text-slate-400">
            Imported Excel seed and future manual transactions live here as the source of truth.
          </p>
        </div>

        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center justify-center rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-500/10"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear Local Ledger
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="Transactions" value={totals.count.toLocaleString()} />
        <Stat label="Buy Value" value={money(totals.buyValue)} />
        <Stat label="Sell Value" value={money(totals.sellValue)} />
      </div>

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Add Transaction</h2>
            <p className="text-sm text-slate-400">Fill the details, then press Confirm Transaction.</p>
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
          <Input label="Ticker" value={form.ticker} onChange={(value) => update("ticker", value)} placeholder="VAS" />
          <Select label="Action" value={form.action} onChange={(value) => update("action", value)} options={["Buy", "Sell", "Dividend", "Deposit", "Withdrawal", "Fee", "Interest", "Other"]} />
          <Input label="Date" type="date" value={form.date} onChange={(value) => update("date", value)} />
          <Input label="Quantity" type="number" value={form.quantity} onChange={(value) => update("quantity", value)} />
          <Input label="Price" type="number" value={form.price} onChange={(value) => update("price", value)} />
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
      </section>

      <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/70 p-5">
        <h2 className="text-lg font-semibold text-white">Ledger</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Ticker</th>
                <th className="px-3 py-2">Qty</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Fees</th>
                <th className="px-3 py-2">Total</th>
                <th className="px-3 py-2">Platform</th>
                <th className="px-3 py-2">Sector</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>

            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-slate-400">
                    No transactions yet. Import your master workbook once, or add a manual transaction.
                  </td>
                </tr>
              ) : (
                [...transactions].reverse().map((tx) => (
                  <tr key={tx.id} className="border-t border-white/10 text-white">
                    <td className="px-3 py-2">{tx.date}</td>
                    <td className="px-3 py-2">{tx.action}</td>
                    <td className="px-3 py-2 font-semibold">{tx.ticker}</td>
                    <td className="px-3 py-2">{Number(tx.quantity ?? 0).toLocaleString()}</td>
                    <td className="px-3 py-2">{money(Number(tx.price ?? 0))}</td>
                    <td className="px-3 py-2">{money(Number(tx.feesAud ?? tx.fiatFees ?? 0))}</td>
                    <td className="px-3 py-2">{money(Number(tx.totalAud ?? tx.total ?? 0))}</td>
                    <td className="px-3 py-2">{tx.platform}</td>
                    <td className="px-3 py-2">{tx.sector}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeTransaction(tx.id)}
                        className="rounded-lg border border-red-500/30 px-2 py-1 text-xs text-red-200 hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </td>
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
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
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
