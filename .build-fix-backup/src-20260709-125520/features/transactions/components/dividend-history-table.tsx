import { transactions } from "../mock-data";
import { formatTransactionMoney } from "../format";

export function DividendHistoryTable() {
  const rows = transactions.filter((tx) => tx.type === "Dividend");

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">Dividend History</h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Date</th>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Symbol</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((tx) => (
            <tr key={tx.id}>
              <td className="px-5 py-4">{tx.date}</td>
              <td className="px-5 py-4 font-semibold">{tx.symbol}</td>
              <td className="px-5 py-4 text-right font-semibold">
                {formatTransactionMoney(tx.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
