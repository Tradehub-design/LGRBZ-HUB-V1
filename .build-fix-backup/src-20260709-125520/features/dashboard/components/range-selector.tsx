"use client";

import type { DashboardRange } from "../types";
import { useDashboardStore } from "../store";

const ranges: DashboardRange[] = ["7D", "30D", "90D", "YTD", "1Y", "ALL"];

export function RangeSelector() {
  const { range, setRange } = useDashboardStore();

  return (
    <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {ranges.map((item) => {
        const active = item === range;

        return (
          <button
            key={item}
            type="button"
            onClick={() => setRange(item)}
            className={[
              "rounded-lg px-3 py-1.5 text-sm font-medium transition",
              active
                ? "bg-slate-950 text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
            ].join(" ")}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
