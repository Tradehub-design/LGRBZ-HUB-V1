"use client";

import { useAttributionStore } from "../store";
import type { AttributionPeriod } from "../types";

const periods: AttributionPeriod[] = ["MTD", "QTD", "YTD", "1Y", "ALL"];

export function AttributionPeriodSelector() {
  const { period, setPeriod } = useAttributionStore();

  return (
    <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {periods.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setPeriod(item)}
          className={[
            "rounded-lg px-3 py-1.5 text-sm font-medium transition",
            period === item
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
