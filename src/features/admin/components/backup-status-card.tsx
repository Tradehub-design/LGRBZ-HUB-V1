const backups = [
  { name: "Daily backup", status: "Completed", time: "2026-07-07 02:00" },
  { name: "Weekly backup", status: "Completed", time: "2026-07-06 02:00" },
  { name: "Manual backup", status: "Available", time: "On demand" },
];

export function BackupStatusCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Backup Status
      </h2>

      <div className="mt-5 space-y-3">
        {backups.map((backup) => (
          <div
            key={backup.name}
            className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <div>
              <div className="text-sm font-semibold text-slate-950">
                {backup.name}
              </div>
              <div className="text-xs text-slate-500">{backup.time}</div>
            </div>

            <span className="text-xs font-semibold text-slate-600">
              {backup.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
