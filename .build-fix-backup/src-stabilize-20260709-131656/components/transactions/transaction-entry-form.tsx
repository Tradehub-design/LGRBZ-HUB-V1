"use client";

import { useMemo, useState } from "react";
import { suggestAssetFields } from "@/lib/transactions/assetIntelligence";

export function TransactionEntryForm() {
  const [ticker, setTicker] = useState("");
  const [action, setAction] = useState("Buy");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [fees, setFees] = useState("");

  const suggestion = useMemo(() => suggestAssetFields(ticker), [ticker]);

  return (
    <div className="rounded-2xl border border-[#173047] bg-[#071827] p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white">New Transaction</h2>
        <p className="mt-1 text-sm text-slate-400">
          Enter the basics. LGRBZ auto-fills the rest.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Ticker">
          <input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="ASX:VAS" className="input" />
        </Field>

        <Field label="Action">
          <select value={action} onChange={(e) => setAction(e.target.value)} className="input">
            <option>Buy</option>
            <option>Sell</option>
            <option>Cash Dividend</option>
            <option>Cash Deposit</option>
            <option>Cash Withdrawal</option>
            <option>Cash Interest</option>
            <option>Fee</option>
          </select>
        </Field>

        <Field label="Date">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
        </Field>

        <Field label="Quantity">
          <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" className="input" />
        </Field>

        <Field label="Price / Cost">
          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="input" />
        </Field>

        <Field label="Fees">
          <input value={fees} onChange={(e) => setFees(e.target.value)} placeholder="0.00" className="input" />
        </Field>
      </div>

      <div className="mt-5 rounded-xl border border-sky-500/20 bg-sky-500/10 p-4">
        <p className="mb-3 text-sm font-semibold text-sky-200">AI Auto-Fill Suggestion</p>

        <div className="grid gap-3 text-sm md:grid-cols-3">
          <Suggestion label="Name" value={suggestion.name} />
          <Suggestion label="Asset Class" value={suggestion.assetClass} />
          <Suggestion label="Sector" value={suggestion.sector} />
          <Suggestion label="Industry" value={suggestion.industry} />
          <Suggestion label="Country" value={suggestion.country} />
          <Suggestion label="Currency" value={suggestion.currency} />
          <Suggestion label="Risk" value={suggestion.riskLevel} />
          <Suggestion label="Dividend Profile" value={suggestion.dividendProfile} />
          <Suggestion label="Strategy" value={suggestion.strategy} />
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Confidence: {Math.round(suggestion.confidence * 100)}%. You can override these later.
        </p>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid #173047;
          background: #0b1e30;
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      {children}
    </label>
  );
}

function Suggestion({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="font-semibold text-white">{value}</p>
    </div>
  );
}
