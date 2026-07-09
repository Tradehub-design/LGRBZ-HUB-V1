"use client";

import { useLivePricesStore } from "../store";

const exchanges = ["All", "ASX", "NASDAQ"];

export function LivePricesFilterBar() {
  const { search, exchange, setSearch, setExchange } = useLivePricesStore();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
      <select
        value={exchange}
        onChange={(event) => setExchange(event.target.value)}
        className="h-10 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
      >
        {exchanges.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>

      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search ticker or company..."
        className="h-10 flex-1 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
      />
    </div>
  );
}
