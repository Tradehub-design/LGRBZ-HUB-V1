import { healthChecks } from "../mock-data";

export function HealthChecksCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Health Checks
      </h2>

      <div className="mt-5 space-y-3">
        {healthChecks.map((check) => (
          <div key={check.id} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-semibold text-slate-950">
                {check.name}
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {check.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {check.description}
            </p>

            <div className="mt-3 h-2 rounded-full bg-white">
              <div
                className="h-2 rounded-full bg-slate-950"
                style={{ width: `${check.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
