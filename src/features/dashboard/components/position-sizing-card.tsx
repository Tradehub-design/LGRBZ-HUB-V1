import { formatMoney } from "../format";

const rows = [
  { label: "Largest Position", value: "NDQ", amount: 20109.6 },
  { label: "Smallest Position", value: "COH", amount: 10680.08 },
  { label: "Average Position", value: "All holdings", amount: 16932.44 },
  { label: "Cash Position", value: "Available", amount: 8450.22 },
];

export function PositionSizingCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Position Sizing
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div>
              <div className="text-sm font-semibold text-slate-950">
                {row.label}
              </div>
              <div className="text-xs text-slate-500">{row.value}</div>
            </div>

            <div className="text-sm font-semibold text-slate-950">
              {formatMoney(row.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
