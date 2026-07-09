import { attributionRows } from "../mock-data";
import { formatAttributionMoney } from "../format";

export function AttributionFooterSummary() {
  const total = attributionRows.reduce(
    (sum, row) => sum + row.contribution,
    0
  );

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Sources" value={attributionRows.length.toString()} />
        <Metric title="Contribution" value={formatAttributionMoney(total)} />
        <Metric title="Top Driver" value="NDQ" />
        <Metric title="Period" value="YTD" />
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
