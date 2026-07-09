import { formatMoney } from "../format";

const rows = [
  {
    symbol: "VAS",
    event: "Ex-Dividend",
    date: "2026-07-12",
    estimatedAmount: 201.6,
  },
  {
    symbol: "VAS",
    event: "Payment",
    date: "2026-07-18",
    estimatedAmount: 201.6,
  },
  {
    symbol: "NAB",
    event: "Ex-Dividend",
    date: "2026-08-07",
    estimatedAmount: 372.3,
  },
  {
    symbol: "NAB",
    event: "Payment",
    date: "2026-08-28",
    estimatedAmount: 372.3,
  },
];

export function DividendCalendarTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Dividend Calendar
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Symbol
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Event
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Date
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Est. Amount
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={`${row.symbol}-${row.event}-${row.date}`}>
                <td className="px-5 py-4 font-semibold text-slate-950">
                  {row.symbol}
                </td>
                <td className="px-5 py-4 text-slate-700">{row.event}</td>
                <td className="px-5 py-4 text-right text-slate-700">
                  {new Date(row.date).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4 text-right font-semibold text-slate-950">
                  {formatMoney(row.estimatedAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
