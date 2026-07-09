import { taxEvents } from "../mock-data";
import { formatTaxMoney } from "../format";

export function DividendTaxCard() {
  const dividends = taxEvents.filter((event) => event.type === "Dividend");
  const total = dividends.reduce((sum, event) => sum + event.amount, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Dividend Tax</h2>

      <div className="mt-5 text-3xl font-semibold text-slate-950">
        {formatTaxMoney(total)}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        Taxable dividend income
      </div>
    </div>
  );
}
