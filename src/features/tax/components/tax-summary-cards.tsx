import { taxEvents } from "../mock-data";
import { formatTaxMoney } from "../format";

export function TaxSummaryCards() {
  const dividends = taxEvents
    .filter((event) => event.type === "Dividend")
    .reduce((sum, event) => sum + event.amount, 0);

  const gains = taxEvents
    .filter((event) => event.type === "Capital Gain")
    .reduce((sum, event) => sum + event.amount, 0);

  const losses = taxEvents
    .filter((event) => event.type === "Capital Loss")
    .reduce((sum, event) => sum + event.amount, 0);

  const fees = taxEvents
    .filter((event) => event.type === "Fee")
    .reduce((sum, event) => sum + event.amount, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Dividend Income" value={formatTaxMoney(dividends)} />
      <Card title="Capital Gains" value={formatTaxMoney(gains)} />
      <Card title="Capital Losses" value={formatTaxMoney(losses)} />
      <Card title="Deductible Fees" value={formatTaxMoney(Math.abs(fees))} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-950">{value}</div>
    </div>
  );
}
