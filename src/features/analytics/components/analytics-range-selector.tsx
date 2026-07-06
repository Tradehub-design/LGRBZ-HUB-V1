"use client";

import { useAnalyticsStore } from "../store";
import type { AnalyticsRange } from "../types";

const ranges: AnalyticsRange[] = ["7D", "30D", "90D", "YTD", "1Y", "ALL"];

export function AnalyticsRangeSelector() {
  const { range, setRange } = useAnalyticsStore();

  return (
    <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {ranges.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setRange(item)}
          className={[
            "rounded-lg px-3 py-1.5 text-sm font-medium transition",
            range === item
              ? "bg-slate-950 text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
          ].join(" ")}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
