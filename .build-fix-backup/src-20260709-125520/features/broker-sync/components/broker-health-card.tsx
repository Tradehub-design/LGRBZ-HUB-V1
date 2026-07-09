const healthRows = [
  {
    broker: "CommSec",
    status: "Healthy",
    detail: "Last sync completed successfully.",
  },
  {
    broker: "CommSec Pocket",
    status: "Healthy",
    detail: "No unresolved import issues.",
  },
];

export function BrokerHealthCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Broker Health</h2>

      <div className="mt-5 space-y-3">
        {healthRows.map((row) => (
          <div key={row.broker} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-semibold text-slate-950">
                {row.broker}
              </div>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {row.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">{row.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
