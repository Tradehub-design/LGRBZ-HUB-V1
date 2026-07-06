import { healthChecks } from "../mock-data";

export function HealthScoreCard() {
  const score = Math.round(
    healthChecks.reduce((sum, item) => sum + item.score, 0) /
      healthChecks.length
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <div className="text-sm font-medium text-slate-500">
        Overall Health Score
      </div>

      <div className="mt-4 text-6xl font-bold text-slate-950">
        {score}
      </div>

      <div className="mt-2 text-sm text-slate-500">out of 100</div>

      <div className="mt-6 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-slate-950"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
