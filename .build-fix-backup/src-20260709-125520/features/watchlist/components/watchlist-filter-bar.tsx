"use client";

import { useWatchlistStore } from "../store";

export function WatchlistFilterBar() {
  const { search, setSearch } = useWatchlistStore();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search ticker or company..."
        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
      />
    </div>
  );
}
