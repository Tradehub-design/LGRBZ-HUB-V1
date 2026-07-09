"use client";

export function TransactionEditorCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Transaction Editor</h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {["Date", "Symbol", "Quantity", "Price", "Fees", "Notes"].map((field) => (
          <input
            key={field}
            placeholder={field}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
        ))}
      </div>

      <button className="mt-4 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
        Save Transaction
      </button>
    </div>
  );
}
