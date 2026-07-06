import { attributionRows } from "../mock-data";
import {
  formatAttributionMoney,
  formatAttributionPercent,
} from "../format";

export function AttributionSummaryCards() {
  const contribution = attributionRows.reduce(
    (sum, row) => sum + row.contribution,
    0
  );

  const value = attributionRows.reduce((sum, row) => sum + row.value, 0);
  const top = [...attributionRows].sort(
    (a, b) => b.contribution - a.contribution
  )[0];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Total Contribution" value={formatAttributionMoney(contribution)} />
      <Card title="Attributed Value" value={formatAttributionMoney(value)} />
      <Card title="Top Driver" value={top.source} />
      <Card title="Top Return" value={formatAttributionPercent(top.contributionPercent)} />
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
