import { dividendRecords } from "../mock-data";
import { formatDividendMoney } from "../format";

export function DividendTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Dividend History
        </h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {[
              "Date",
              "Symbol",
              "Shares",
              "Dividend",
              "Gross",
              "Net",
            ].map((item) => (
              <th
                key={item}
                className="px-5 py-3 text-left font-semibold text-slate-600"
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {dividendRecords.map((row) => (
            <tr key={row.id}>
              <td className="px-5 py-4">{row.date}</td>
              <td className="px-5 py-4">
                <div className="font-semibold">{row.symbol}</div>
                <div className="text-xs text-slate-500">{row.company}</div>
              </td>
              <td className="px-5 py-4">{row.shares}</td>
              <td className="px-5 py-4">
                {formatDividendMoney(row.dividendPerShare)}
              </td>
              <td className="px-5 py-4 font-semibold">
                {formatDividendMoney(row.grossAmount)}
              </td>
              <td className="px-5 py-4 font-semibold text-emerald-700">
                {formatDividendMoney(row.netAmount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
