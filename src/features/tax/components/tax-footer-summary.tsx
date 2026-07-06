import { taxEvents } from "../mock-data";
import { formatTaxMoney } from "../format";

export function TaxFooterSummary() {
  const total = taxEvents.reduce((sum, event) => sum + event.amount, 0);
  const gains = taxEvents
    .filter((event) => event.type === "Capital Gain")
    .reduce((sum, event) => sum + event.amount, 0);
  const losses = taxEvents
    .filter((event) => event.type === "Capital Loss")
    .reduce((sum, event) => sum + event.amount, 0);
  const dividends = taxEvents
    .filter((event) => event.type === "Dividend")
    .reduce((sum, event) => sum + event.amount, 0);

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Total Tax Events" value={taxEvents.length.toString()} />
        <Metric title="Dividends" value={formatTaxMoney(dividends)} />
        <Metric title="Capital Gains" value={formatTaxMoney(gains)} />
        <Metric title="Net Total" value={formatTaxMoney(total + losses)} />
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
