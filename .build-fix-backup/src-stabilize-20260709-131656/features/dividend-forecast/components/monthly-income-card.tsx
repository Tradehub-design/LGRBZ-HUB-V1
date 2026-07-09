import { formatForecastMoney } from "../format";

const monthlyIncome = [
  { month: "Jan", income: 0 },
  { month: "Feb", income: 0 },
  { month: "Mar", income: 403.2 },
  { month: "Apr", income: 0 },
  { month: "May", income: 372.6 },
  { month: "Jun", income: 0 },
  { month: "Jul", income: 0 },
  { month: "Aug", income: 0 },
  { month: "Sep", income: 62.9 },
  { month: "Oct", income: 403.2 },
  { month: "Nov", income: 0 },
  { month: "Dec", income: 372.6 },
];

export function MonthlyIncomeCard() {
  const highest = Math.max(...monthlyIncome.map((item) => item.income));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Monthly Income Forecast
      </h2>

      <div className="mt-6 flex h-44 items-end gap-2">
        {monthlyIncome.map((item) => (
          <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-lg bg-slate-950"
              style={{
                height: `${highest === 0 ? 8 : Math.max(8, (item.income / highest) * 150)}px`,
              }}
            />
            <span className="text-xs font-medium text-slate-500">
              {item.month}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-2 md:grid-cols-3">
        {monthlyIncome
          .filter((item) => item.income > 0)
          .map((item) => (
            <div key={item.month} className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">{item.month}</div>
              <div className="mt-1 text-sm font-semibold text-slate-950">
                {formatForecastMoney(item.income)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
