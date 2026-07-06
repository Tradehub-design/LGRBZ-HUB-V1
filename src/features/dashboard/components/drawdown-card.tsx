import { formatMoney, formatPercent } from "../format";

const drawdowns = [
  {
    period: "Current Drawdown",
    value: -1240.22,
    percent: -0.96,
  },
  {
    period: "Max Drawdown",
    value: -6420.44,
    percent: -5.82,
  },
  {
    period: "Average Drawdown",
    value: -1840.32,
    percent: -1.64,
  },
];

export function DrawdownCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Drawdown Summary
      </h2>

      <div className="mt-5 space-y-3">
        {drawdowns.map((row) => (
          <div
            key={row.period}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="text-sm font-medium text-slate-600">
              {row.period}
            </span>

            <div className="text-right">
              <div className="text-sm font-semibold text-rose-700">
                {formatMoney(row.value)}
              </div>
              <div className="text-xs text-rose-600">
                {formatPercent(row.percent)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
