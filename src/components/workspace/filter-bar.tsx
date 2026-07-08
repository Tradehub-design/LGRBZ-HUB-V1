"use client";

import { Search } from "lucide-react";

export function FilterBar({
  placeholder = "Search...",
  right,
}: {
  placeholder?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#173047] bg-[#071827] p-3 shadow-xl md:flex-row md:items-center md:justify-between">
      <div className="flex h-11 flex-1 items-center gap-3 rounded-lg border border-[#173047] bg-[#0b1e30] px-3 text-slate-500">
        <Search className="h-4 w-4" />
        <input
          className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-600"
          placeholder={placeholder}
        />
      </div>

      {right ? <div className="flex flex-wrap gap-2">{right}</div> : null}
    </div>
  );
}
