import { accountBreakdown } from "../mock-data";
import {
  formatAnalyticsMoney,
  formatAnalyticsPercent,
} from "../format";

export function AccountPerformanceTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Performance by Account
        </h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Account</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Value</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">P/L</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Return</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Weight</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {accountBreakdown.map((row) => (
            <tr key={row.label}>
              <td className="px-5 py-4 font-semibold text-slate-950">{row.label}</td>
              <td className="px-5 py-4 text-right">{formatAnalyticsMoney(row.value)}</td>
              <td className="px-5 py-4 text-right font-semibold text-emerald-700">
                {formatAnalyticsMoney(row.pnl)}
              </td>
              <td className="px-5 py-4 text-right font-semibold text-emerald-700">
                {formatAnalyticsPercent(row.returnPercent)}
              </td>
              <td className="px-5 py-4 text-right">{row.weight.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
