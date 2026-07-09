"use client";

import type { HoldingRow } from "../types";
import {
  formatHoldingMoney,
  formatHoldingNumber,
  formatHoldingPercent,
} from "../format";

type HoldingDetailDrawerProps = {
  holding: HoldingRow | null;
  onClose: () => void;
};

export function HoldingDetailDrawer({
  holding,
  onClose,
}: HoldingDetailDrawerProps) {
  if (!holding) return null;

  const positive = holding.unrealisedPnl >= 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/30">
      <button
        type="button"
        aria-label="Close holding detail"
        className="absolute inset-0 h-full w-full cursor-default"
        onClick={onClose}
      />

      <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              {holding.symbol}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{holding.name}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Market Value
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-950">
              {formatHoldingMoney(holding.marketValue, holding.currency)}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Unrealised P/L
            </div>
            <div
              className={[
                "mt-2 text-2xl font-semibold",
                positive ? "text-emerald-700" : "text-rose-700",
              ].join(" ")}
            >
              {formatHoldingMoney(holding.unrealisedPnl, holding.currency)}
            </div>
            <div
              className={[
                "mt-1 text-sm",
                positive ? "text-emerald-600" : "text-rose-600",
              ].join(" ")}
            >
              {formatHoldingPercent(holding.unrealisedPnlPercent)}
            </div>
          </div>
        </div>

        <div className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-200">
          {[
            ["Exchange", holding.exchange],
            ["Asset Class", holding.assetClass],
            ["Sector", holding.sector],
            ["Currency", holding.currency],
            ["Quantity", formatHoldingNumber(holding.quantity)],
            ["Average Price", formatHoldingMoney(holding.averagePrice, holding.currency)],
            ["Current Price", formatHoldingMoney(holding.currentPrice, holding.currency)],
            ["Cost Base", formatHoldingMoney(holding.costBase, holding.currency)],
            ["Portfolio Weight", `${holding.portfolioWeight.toFixed(2)}%`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
            >
              <span className="text-slate-500">{label}</span>
              <span className="font-semibold text-slate-950">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
