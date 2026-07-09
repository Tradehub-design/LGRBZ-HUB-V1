import { formatMoney } from "../format";

const projections = [
  {
    year: "5 Years",
    conservative: 178000,
    base: 204000,
    optimistic: 236000,
  },
  {
    year: "10 Years",
    conservative: 258000,
    base: 334000,
    optimistic: 438000,
  },
  {
    year: "20 Years",
    conservative: 526000,
    base: 812000,
    optimistic: 1240000,
  },
];

export function ProjectionCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Portfolio Projection
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Timeframe
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Conservative
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Base
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Optimistic
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {projections.map((row) => (
              <tr key={row.year} className="hover:bg-slate-50">
                <td className="px-5 py-4 font-semibold text-slate-950">
                  {row.year}
                </td>
                <td className="px-5 py-4 text-right text-slate-700">
                  {formatMoney(row.conservative)}
                </td>
                <td className="px-5 py-4 text-right font-semibold text-slate-950">
                  {formatMoney(row.base)}
                </td>
                <td className="px-5 py-4 text-right text-slate-700">
                  {formatMoney(row.optimistic)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
