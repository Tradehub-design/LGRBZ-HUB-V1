"use client";

import { holdingAccounts } from "../mock-data";
import { useHoldingsStore } from "../store";

export function HoldingsFilterBar() {
  const { accountId, search, setAccountId, setSearch } = useHoldingsStore();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={accountId}
          onChange={(event) => setAccountId(event.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400"
        >
          {holdingAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search symbol or name..."
          className="h-10 min-w-[260px] rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
        />
      </div>

      <div className="text-sm text-slate-500">
        Filter positions by account, ticker or company name.
      </div>
    </div>
  );
}
