const schedules = [
  { name: "Weekly Portfolio Report", frequency: "Weekly", status: "Active" },
  { name: "Monthly Tax Snapshot", frequency: "Monthly", status: "Paused" },
  { name: "Dividend Income Report", frequency: "Quarterly", status: "Active" },
];

export function ScheduledReportsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Scheduled Reports
      </h2>

      <div className="mt-5 space-y-3">
        {schedules.map((item) => (
          <div key={item.name} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-slate-950">
                {item.name}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {item.status}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500">{item.frequency}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
