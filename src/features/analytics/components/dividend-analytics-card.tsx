import { formatAnalyticsMoney } from "../format";

const dividends = [
  { month: "Jan", amount: 215 },
  { month: "Feb", amount: 186 },
  { month: "Mar", amount: 420 },
  { month: "Apr", amount: 152 },
  { month: "May", amount: 510 },
  { month: "Jun", amount: 372 },
];

export function DividendAnalyticsCard() {
  const total = dividends.reduce((a, b) => a + b.amount, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Dividend Analytics
      </h2>

      <div className="mt-5 text-3xl font-semibold">
        {formatAnalyticsMoney(total)}
      </div>

      <div className="mt-5 divide-y divide-slate-100">
        {dividends.map((item) => (
          <div
            key={item.month}
            className="flex justify-between py-3"
          >
            <span>{item.month}</span>
            <span className="font-semibold">
              {formatAnalyticsMoney(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
