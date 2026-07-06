import { healthChecks } from "../mock-data";

export function PortfolioHealthSummary() {
  const score = Math.round(
    healthChecks.reduce((sum, item) => sum + item.score, 0) /
      healthChecks.length
  );

  const watch = healthChecks.filter((item) => item.status === "Watch").length;
  const risk = healthChecks.filter((item) => item.status === "Risk").length;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Health Score" value={`${score}/100`} />
      <Card title="Checks" value={healthChecks.length.toString()} />
      <Card title="Watch Items" value={watch.toString()} />
      <Card title="Risk Items" value={risk.toString()} />
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
