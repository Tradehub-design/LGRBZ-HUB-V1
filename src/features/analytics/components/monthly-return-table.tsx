const months = [
  ["Jan", 4.25],
  ["Feb", -2.31],
  ["Mar", 10.33],
  ["Apr", 6.09],
  ["May", 3.76],
  ["Jun", 3.91],
];

export function MonthlyReturnTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold">
          Monthly Returns
        </h2>
      </div>

      <table className="min-w-full">
        <tbody>
          {months.map(([month, value]) => (
            <tr
              key={month}
              className="border-b border-slate-100"
            >
              <td className="px-5 py-4 font-semibold">
                {month}
              </td>

              <td
                className={`px-5 py-4 text-right font-semibold ${
                  Number(value) >= 0
                    ? "text-emerald-700"
                    : "text-rose-700"
                }`}
              >
                {value}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
