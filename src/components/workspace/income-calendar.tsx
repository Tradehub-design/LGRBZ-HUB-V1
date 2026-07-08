import { formatMoney } from "@/lib/portfolio-engine/format";
import type { DividendRecord } from "@/lib/portfolio-engine/types";

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function IncomeCalendar({ dividends }: { dividends: DividendRecord[] }) {
  const byMonth = new Map<number, number>();

  dividends.forEach((dividend) => {
    const month = Number(dividend.date.slice(5, 7)) - 1;
    byMonth.set(month, (byMonth.get(month) ?? 0) + dividend.amountAud);
  });

  const max = Math.max(...[...byMonth.values()], 1);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {months.map((month, index) => {
        const amount = byMonth.get(index) ?? 0;
        const strength = amount / max;

        return (
          <div
            key={month}
            className="rounded-xl border border-[#173047] bg-[#0b1e30] p-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white">{month}</p>
              <p className="text-sm text-emerald-300">{formatMoney(amount, 2)}</p>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${Math.max(4, strength * 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
