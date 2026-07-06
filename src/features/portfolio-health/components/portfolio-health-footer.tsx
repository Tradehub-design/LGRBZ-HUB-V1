import { healthChecks } from "../mock-data";

export function PortfolioHealthFooter() {
  const score = Math.round(
    healthChecks.reduce((sum, item) => sum + item.score, 0) /
      healthChecks.length
  );

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric
          title="Health Score"
          value={`${score}/100`}
        />

        <Metric
          title="Checks"
          value={healthChecks.length.toString()}
        />

        <Metric
          title="Portfolio Status"
          value="Healthy"
        />

        <Metric
          title="Review"
          value="Quarterly"
        />
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-400">
        {title}
      </div>

      <div className="mt-2 text-2xl font-semibold">
        {value}
      </div>
    </div>
  );
}
