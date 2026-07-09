import { attributionRows } from "../mock-data";
import {
  formatAttributionMoney,
  formatAttributionPercent,
} from "../format";

export function AttributionTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Attribution Table
        </h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Source</th>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Category</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Value</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Contribution</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Return</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Weight</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {attributionRows.map((row) => (
            <tr key={row.id}>
              <td className="px-5 py-4 font-semibold text-slate-950">{row.source}</td>
              <td className="px-5 py-4 text-slate-600">{row.category}</td>
              <td className="px-5 py-4 text-right">{formatAttributionMoney(row.value)}</td>
              <td className="px-5 py-4 text-right font-semibold text-emerald-700">
                {formatAttributionMoney(row.contribution)}
              </td>
              <td className="px-5 py-4 text-right font-semibold text-emerald-700">
                {formatAttributionPercent(row.contributionPercent)}
              </td>
              <td className="px-5 py-4 text-right">{row.weight.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
