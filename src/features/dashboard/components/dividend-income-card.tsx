import { formatMoney } from "../format";

const dividends = [
  { month: "Jan", amount: 182.4 },
  { month: "Feb", amount: 94.12 },
  { month: "Mar", amount: 318.66 },
  { month: "Apr", amount: 126.9 },
  { month: "May", amount: 244.18 },
  { month: "Jun", amount: 391.72 },
  { month: "Jul", amount: 86.44 },
];

export function DividendIncomeCard() {
  const total = dividends.reduce((sum, item) => sum + item.amount, 0);
  const highest = Math.max(...dividends.map((item) => item.amount));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Dividend Income
          </h2>
          <p className="mt-1 text-sm text-slate-500">Year to date received</p>
        </div>

        <div className="text-right">
          <div className="text-xl font-semibold text-slate-950">
            {formatMoney(total)}
          </div>
          <div className="text-xs text-slate-500">YTD</div>
        </div>
      </div>

      <div className="mt-6 flex h-36 items-end gap-2">
        {dividends.map((item) => (
          <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-lg bg-slate-950"
              style={{
                height: `${Math.max(8, (item.amount / highest) * 120)}px`,
              }}
            />
            <span className="text-xs font-medium text-slate-500">
              {item.month}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
