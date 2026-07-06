import { formatMoney } from "../format";

const rows = [
  {
    label: "Cash Available",
    value: 8450.22,
  },
  {
    label: "Settlement Pending",
    value: 0,
  },
  {
    label: "Dividend Receivable",
    value: 412.18,
  },
  {
    label: "Estimated Buying Power",
    value: 8862.4,
  },
];

export function LiquidityCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Liquidity</h2>

      <div className="mt-5 divide-y divide-slate-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <span className="text-sm font-medium text-slate-600">
              {row.label}
            </span>

            <span className="text-sm font-semibold text-slate-950">
              {formatMoney(row.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
