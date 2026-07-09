"use client";

import { holdingRows } from "../mock-data";
import { useHoldingsStore } from "../store";
import { formatHoldingMoney, formatHoldingPercent } from "../format";

function getFilteredRows(accountId: string) {
  if (accountId === "all") return holdingRows;
  return holdingRows.filter((row) => row.accountId === accountId);
}

export function HoldingsSummaryCards() {
  const { accountId } = useHoldingsStore();
  const rows = getFilteredRows(accountId);

  const marketValue = rows.reduce((sum, row) => sum + row.marketValue, 0);
  const costBase = rows.reduce((sum, row) => sum + row.costBase, 0);
  const pnl = marketValue - costBase;
  const pnlPercent = costBase === 0 ? 0 : (pnl / costBase) * 100;
  const count = rows.length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Market Value</p>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
          {formatHoldingMoney(marketValue)}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Cost Base</p>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
          {formatHoldingMoney(costBase)}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Unrealised P/L</p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <p
            className={[
              "text-2xl font-semibold tracking-tight",
              pnl >= 0 ? "text-emerald-700" : "text-rose-700",
            ].join(" ")}
          >
            {formatHoldingMoney(pnl)}
          </p>
          <span
            className={[
              "rounded-full px-2.5 py-1 text-xs font-semibold",
              pnl >= 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700",
            ].join(" ")}
          >
            {formatHoldingPercent(pnlPercent)}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">Positions</p>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
          {count}
        </p>
      </div>
    </div>
  );
}
