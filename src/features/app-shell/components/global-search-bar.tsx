"use client";

import { useState } from "react";
import { searchResults } from "../mock-data";

export function GlobalSearchBar() {
  const [query, setQuery] = useState("");

  const filtered = searchResults.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-lg">
      <input
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-slate-400"
        placeholder="Search holdings, reports, dividends..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {query.length > 0 && (
        <div className="absolute mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer border-b border-slate-100 px-4 py-3 hover:bg-slate-50 last:border-none"
            >
              <div className="font-semibold">
                {item.title}
              </div>

              <div className="text-sm text-slate-500">
                {item.subtitle}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-4 text-sm text-slate-500">
              No results found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
