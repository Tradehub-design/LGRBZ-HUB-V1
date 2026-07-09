import { formatMoney, formatPercent } from "../format";

const rows = [
  { month: "January", opening: 100000, closing: 104250, pnl: 4250, percent: 4.25 },
  { month: "February", opening: 104250, closing: 101900, pnl: -2350, percent: -2.25 },
  { month: "March", opening: 101900, closing: 112430, pnl: 10530, percent: 10.33 },
  { month: "April", opening: 112430, closing: 119280, pnl: 6850, percent: 6.09 },
  { month: "May", opening: 119280, closing: 123760, pnl: 4480, percent: 3.76 },
  { month: "June", opening: 123760, closing: 128420.72, pnl: 4660.72, percent: 3.76 },
];

export function MonthlyPerformanceTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Monthly Performance
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Month
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Opening
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Closing
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                P/L
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Return
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const positive = row.pnl >= 0;

              return (
                <tr key={row.month} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-950">
                    {row.month}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-700">
                    {formatMoney(row.opening)}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-700">
                    {formatMoney(row.closing)}
                  </td>
                  <td
                    className={[
                      "px-5 py-4 text-right font-semibold",
                      positive ? "text-emerald-700" : "text-rose-700",
                    ].join(" ")}
                  >
                    {formatMoney(row.pnl)}
                  </td>
                  <td
                    className={[
                      "px-5 py-4 text-right font-semibold",
                      positive ? "text-emerald-700" : "text-rose-700",
                    ].join(" ")}
                  >
                    {formatPercent(row.percent)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
