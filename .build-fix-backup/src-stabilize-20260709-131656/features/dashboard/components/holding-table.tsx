import { holdings } from "../mock-data";
import { formatMoney, formatPercent } from "../format";

export function HoldingTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">Holdings</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Asset
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Qty
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Avg Price
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Price
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Value
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                P/L
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {holdings.map((holding) => {
              const value = holding.quantity * holding.currentPrice;
              const cost = holding.quantity * holding.averagePrice;
              const pnl = value - cost;
              const pnlPercent = cost === 0 ? 0 : (pnl / cost) * 100;

              return (
                <tr key={holding.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-950">
                      {holding.symbol}
                    </div>
                    <div className="text-xs text-slate-500">
                      {holding.name}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right text-slate-700">
                    {holding.quantity.toLocaleString("en-AU")}
                  </td>

                  <td className="px-5 py-4 text-right text-slate-700">
                    {formatMoney(holding.averagePrice, holding.currency)}
                  </td>

                  <td className="px-5 py-4 text-right text-slate-700">
                    {formatMoney(holding.currentPrice, holding.currency)}
                  </td>

                  <td className="px-5 py-4 text-right font-medium text-slate-950">
                    {formatMoney(value, holding.currency)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div
                      className={
                        pnl >= 0 ? "text-emerald-700" : "text-rose-700"
                      }
                    >
                      {formatMoney(pnl, holding.currency)}
                    </div>
                    <div
                      className={[
                        "text-xs",
                        pnl >= 0 ? "text-emerald-600" : "text-rose-600",
                      ].join(" ")}
                    >
                      {formatPercent(pnlPercent)}
                    </div>
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
