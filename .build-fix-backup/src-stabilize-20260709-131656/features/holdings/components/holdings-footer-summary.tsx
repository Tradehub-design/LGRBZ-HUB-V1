"use client";

import { holdingRows } from "../mock-data";
import { useHoldingsStore } from "../store";
import { formatHoldingMoney, formatHoldingPercent } from "../format";

export function HoldingsFooterSummary() {
  const { accountId } = useHoldingsStore();

  const rows = holdingRows.filter(
    (row) => accountId === "all" || row.accountId === accountId
  );

  const marketValue = rows.reduce((sum, row) => sum + row.marketValue, 0);
  const costBase = rows.reduce((sum, row) => sum + row.costBase, 0);
  const pnl = marketValue - costBase;
  const pnlPercent = costBase === 0 ? 0 : (pnl / costBase) * 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Holdings
          </div>
          <div className="mt-2 text-xl font-semibold">{rows.length}</div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Market Value
          </div>
          <div className="mt-2 text-xl font-semibold">
            {formatHoldingMoney(marketValue)}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Unrealised P/L
          </div>
          <div className="mt-2 text-xl font-semibold text-emerald-300">
            {formatHoldingMoney(pnl)}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Return
          </div>
          <div className="mt-2 text-xl font-semibold text-emerald-300">
            {formatHoldingPercent(pnlPercent)}
          </div>
        </div>
      </div>
    </div>
  );
}
