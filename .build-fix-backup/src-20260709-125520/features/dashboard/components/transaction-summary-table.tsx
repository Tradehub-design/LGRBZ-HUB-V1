import { formatMoney } from "../format";

const rows = [
  {
    date: "2026-07-05",
    type: "Buy",
    account: "ETF Builder",
    symbol: "NDQ",
    amount: 478.8,
  },
  {
    date: "2026-07-03",
    type: "Dividend",
    account: "Main Portfolio",
    symbol: "VAS",
    amount: 201.6,
  },
  {
    date: "2026-06-30",
    type: "Buy",
    account: "Main Portfolio",
    symbol: "VAS",
    amount: 779.52,
  },
  {
    date: "2026-06-27",
    type: "Sell",
    account: "Main Portfolio",
    symbol: "NAB",
    amount: 745.2,
  },
];

export function TransactionSummaryTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Transaction Summary
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Date
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Type
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Account
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Symbol
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Amount
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={`${row.date}-${row.type}-${row.symbol}`} className="hover:bg-slate-50">
                <td className="px-5 py-4 text-slate-700">
                  {new Date(row.date).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-950">
                  {row.type}
                </td>
                <td className="px-5 py-4 text-slate-700">{row.account}</td>
                <td className="px-5 py-4 font-semibold text-slate-950">
                  {row.symbol}
                </td>
                <td className="px-5 py-4 text-right font-semibold text-slate-950">
                  {formatMoney(row.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
