import { formatMoney } from "../format";

const rows = [
  {
    label: "Top 1 Holding",
    value: 20109.6,
    percentage: 15.66,
  },
  {
    label: "Top 3 Holdings",
    value: 57820.72,
    percentage: 45.02,
  },
  {
    label: "Top 5 Holdings",
    value: 98420.72,
    percentage: 76.64,
  },
];

export function HoldingConcentrationCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Holding Concentration
      </h2>

      <div className="mt-5 space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{row.label}</span>
              <span className="text-slate-500">
                {row.percentage.toFixed(2)}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-950"
                style={{ width: `${row.percentage}%` }}
              />
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {formatMoney(row.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
