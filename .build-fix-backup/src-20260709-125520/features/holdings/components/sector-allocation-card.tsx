"use client";

import { holdingRows } from "../mock-data";
import { useHoldingsStore } from "../store";
import { formatHoldingMoney } from "../format";

export function SectorAllocationCard() {
  const { accountId } = useHoldingsStore();

  const rows = holdingRows.filter(
    (row) => accountId === "all" || row.accountId === accountId
  );

  const total = rows.reduce((sum, row) => sum + row.marketValue, 0);

  const sectors = Object.values(
    rows.reduce((acc, row) => {
      if (!acc[row.sector]) {
        acc[row.sector] = {
          sector: row.sector,
          value: 0,
        };
      }

      acc[row.sector].value += row.marketValue;
      return acc;
    }, {} as Record<string, { sector: string; value: number }>)
  ).sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Sector Allocation
      </h2>

      <div className="mt-5 space-y-4">
        {sectors.map((sector) => {
          const percent = total === 0 ? 0 : (sector.value / total) * 100;

          return (
            <div key={sector.sector}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {sector.sector}
                </span>

                <span className="text-sm text-slate-500">
                  {percent.toFixed(2)}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-950"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="mt-1 text-xs text-slate-500">
                {formatHoldingMoney(sector.value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
