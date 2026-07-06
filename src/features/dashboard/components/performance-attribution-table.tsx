import { formatMoney, formatPercent } from "../format";

const rows = [
  {
    source: "ETF Growth",
    contribution: 8420.2,
    percentage: 45.32,
  },
  {
    source: "Individual Shares",
    contribution: 6120.4,
    percentage: 32.94,
  },
  {
    source: "Dividends",
    contribution: 1444.42,
    percentage: 7.77,
  },
  {
    source: "FX Movement",
    contribution: 820.18,
    percentage: 4.41,
  },
  {
    source: "Cash Interest",
    contribution: 176.4,
    percentage: 0.95,
  },
];

export function PerformanceAttributionTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Performance Attribution
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-semibold text-slate-600">
                Source
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Contribution
              </th>
              <th className="px-5 py-3 text-right font-semibold text-slate-600">
                Share
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const positive = row.contribution >= 0;

              return (
                <tr key={row.source} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-950">
                    {row.source}
                  </td>
                  <td
                    className={[
                      "px-5 py-4 text-right font-semibold",
                      positive ? "text-emerald-700" : "text-rose-700",
                    ].join(" ")}
                  >
                    {formatMoney(row.contribution)}
                  </td>
                  <td className="px-5 py-4 text-right text-slate-700">
                    {formatPercent(row.percentage)}
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
