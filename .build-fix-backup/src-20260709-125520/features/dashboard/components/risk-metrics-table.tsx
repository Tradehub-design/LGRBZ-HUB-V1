import { formatPercent } from "../format";

const rows = [
  {
    metric: "Volatility",
    value: formatPercent(12.84),
    note: "Moderate",
  },
  {
    metric: "Sharpe Ratio",
    value: "1.18",
    note: "Healthy",
  },
  {
    metric: "Max Drawdown",
    value: formatPercent(-5.82),
    note: "Controlled",
  },
  {
    metric: "Cash Buffer",
    value: formatPercent(6.67),
    note: "Below target",
  },
  {
    metric: "Single Stock Exposure",
    value: formatPercent(31.51),
    note: "Above target",
  },
];

export function RiskMetricsTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Risk Metrics
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Metric
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Value
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Note
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.metric} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-semibold text-slate-950">
                  {row.metric}
                </td>
                <td className="px-5 py-4 text-right text-slate-700">
                  {row.value}
                </td>
                <td className="px-5 py-4 text-slate-700">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
