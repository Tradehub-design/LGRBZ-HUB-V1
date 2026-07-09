import { taxEvents } from "../mock-data";
import { formatTaxMoney } from "../format";

export function TaxYearCard() {
  const rows = Object.entries(
    taxEvents.reduce((acc, event) => {
      acc[event.taxYear] = (acc[event.taxYear] ?? 0) + event.amount;
      return acc;
    }, {} as Record<string, number>)
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Tax Year Summary</h2>

      <div className="mt-5 space-y-3">
        {rows.map(([year, amount]) => (
          <div
            key={year}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="text-sm font-semibold text-slate-950">{year}</span>
            <span className="text-sm font-semibold text-slate-950">
              {formatTaxMoney(amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
