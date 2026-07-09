import { dividendForecastRows } from "../mock-data";
import {
  formatForecastMoney,
  formatForecastPercent,
} from "../format";

export function DividendForecastTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Forecast Table
        </h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Holding</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Shares</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">DPS</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Annual Income</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Yield on Cost</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Frequency</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {dividendForecastRows.map((row) => (
            <tr key={row.id}>
              <td className="px-5 py-4">
                <div className="font-semibold text-slate-950">{row.symbol}</div>
                <div className="text-xs text-slate-500">{row.company}</div>
              </td>
              <td className="px-5 py-4 text-right">{row.shares}</td>
              <td className="px-5 py-4 text-right">
                {formatForecastMoney(row.dividendPerShare)}
              </td>
              <td className="px-5 py-4 text-right font-semibold text-emerald-700">
                {formatForecastMoney(row.annualIncome)}
              </td>
              <td className="px-5 py-4 text-right">
                {formatForecastPercent(row.yieldOnCost)}
              </td>
              <td className="px-5 py-4 text-right">{row.paymentFrequency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
