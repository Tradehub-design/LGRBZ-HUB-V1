const rebalanceRows = [
  {
    asset: "NDQ",
    current: 26.61,
    target: 25,
    action: "Trim",
  },
  {
    asset: "VAS",
    current: 35.21,
    target: 40,
    action: "Add",
  },
  {
    asset: "Cash",
    current: 6.67,
    target: 10,
    action: "Add",
  },
  {
    asset: "Individual Shares",
    current: 31.51,
    target: 25,
    action: "Trim",
  },
];

export function RebalanceCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Rebalance Check
      </h2>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 text-left font-semibold text-slate-500">
                Asset
              </th>
              <th className="pb-3 text-right font-semibold text-slate-500">
                Current
              </th>
              <th className="pb-3 text-right font-semibold text-slate-500">
                Target
              </th>
              <th className="pb-3 text-right font-semibold text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rebalanceRows.map((row) => (
              <tr key={row.asset}>
                <td className="py-3 font-semibold text-slate-950">
                  {row.asset}
                </td>
                <td className="py-3 text-right text-slate-600">
                  {row.current.toFixed(2)}%
                </td>
                <td className="py-3 text-right text-slate-600">
                  {row.target.toFixed(2)}%
                </td>
                <td className="py-3 text-right">
                  <span
                    className={[
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      row.action === "Add"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700",
                    ].join(" ")}
                  >
                    {row.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
