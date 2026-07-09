const maintenance = [
  "Refresh cached dashboard metrics",
  "Recalculate dividend forecast",
  "Rebuild allocation summaries",
  "Validate report templates",
];

export function SystemMaintenanceCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        System Maintenance
      </h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {maintenance.map((item) => (
          <button
            key={item}
            type="button"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-950 hover:bg-slate-100"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
