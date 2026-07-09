import { dividendForecastRows } from "../mock-data";
import { formatForecastMoney } from "../format";

export function UpcomingPaymentsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Upcoming Payments
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {dividendForecastRows.map((row) => (
          <div key={row.id} className="flex justify-between py-3">
            <div>
              <div className="text-sm font-semibold text-slate-950">
                {row.symbol}
              </div>
              <div className="text-xs text-slate-500">
                Ex-date {row.nextExDate} · Pay {row.nextPaymentDate}
              </div>
            </div>

            <div className="text-sm font-semibold text-emerald-700">
              {formatForecastMoney(row.annualIncome / 4)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
