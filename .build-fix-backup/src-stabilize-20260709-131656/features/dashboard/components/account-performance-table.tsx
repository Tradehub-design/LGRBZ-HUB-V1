import { formatMoney, formatPercent } from "../format";

const rows = [
  {
    account: "Main Portfolio",
    broker: "CommSec",
    value: 68420.12,
    invested: 58400,
    pnl: 10020.12,
    returnValue: 17.16,
  },
  {
    account: "ETF Builder",
    broker: "CommSec Pocket",
    value: 31860.2,
    invested: 26880,
    pnl: 4980.2,
    returnValue: 18.53,
  },
  {
    account: "Baby Portfolio",
    broker: "Long Term",
    value: 7820.4,
    invested: 7140,
    pnl: 680.4,
    returnValue: 9.53,
  },
  {
    account: "Cash Reserve",
    broker: "Bank Account",
    value: 20320,
    invested: 20320,
    pnl: 0,
    returnValue: 0,
  },
];

export function AccountPerformanceTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Account Performance
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Account
              </th>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Broker
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Value
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Invested
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
                <tr key={row.account} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-950">
                    {row.account}
                  </td>
                  <td className="px-5 py-4 text-slate-700">{row.broker}</td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-950">
                    {formatMoney(row.value)}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-700">
                    {formatMoney(row.invested)}
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
                    {formatPercent(row.returnValue)}
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
