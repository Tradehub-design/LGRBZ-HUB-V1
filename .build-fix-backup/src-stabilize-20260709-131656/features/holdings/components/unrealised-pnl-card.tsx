"use client";

import { holdingRows } from "../mock-data";
import { useHoldingsStore } from "../store";
import { formatHoldingMoney, formatHoldingPercent } from "../format";

export function UnrealisedPnlCard() {
  const { accountId } = useHoldingsStore();

  const rows = holdingRows.filter(
    (row) => accountId === "all" || row.accountId === accountId
  );

  const positiveRows = rows.filter((row) => row.unrealisedPnl >= 0);
  const negativeRows = rows.filter((row) => row.unrealisedPnl < 0);

  const gains = positiveRows.reduce((sum, row) => sum + row.unrealisedPnl, 0);
  const losses = negativeRows.reduce((sum, row) => sum + row.unrealisedPnl, 0);
  const net = gains + losses;

  const totalCost = rows.reduce((sum, row) => sum + row.costBase, 0);
  const netPercent = totalCost === 0 ? 0 : (net / totalCost) * 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Unrealised P/L
      </h2>

      <div className="mt-5 space-y-3">
        <div className="rounded-xl bg-emerald-50 px-4 py-3">
          <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            Gains
          </div>
          <div className="mt-2 text-lg font-semibold text-emerald-800">
            {formatHoldingMoney(gains)}
          </div>
        </div>

        <div className="rounded-xl bg-rose-50 px-4 py-3">
          <div className="text-xs font-medium uppercase tracking-wide text-rose-700">
            Losses
          </div>
          <div className="mt-2 text-lg font-semibold text-rose-800">
            {formatHoldingMoney(losses)}
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 px-4 py-3">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Net Unrealised P/L
          </div>
          <div
            className={[
              "mt-2 text-lg font-semibold",
              net >= 0 ? "text-emerald-700" : "text-rose-700",
            ].join(" ")}
          >
            {formatHoldingMoney(net)}
          </div>
          <div
            className={[
              "mt-1 text-xs",
              net >= 0 ? "text-emerald-600" : "text-rose-600",
            ].join(" ")}
          >
            {formatHoldingPercent(netPercent)}
          </div>
        </div>
      </div>
    </div>
  );
}
