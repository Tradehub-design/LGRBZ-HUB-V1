const dataOptions = [
  {
    title: "Auto-save changes",
    description: "Automatically save preference updates.",
    value: "Enabled",
  },
  {
    title: "Backup frequency",
    description: "Create regular backups of portfolio data.",
    value: "Weekly",
  },
  {
    title: "Import duplicate check",
    description: "Detect duplicate broker transactions.",
    value: "Enabled",
  },
];

export function DataPreferencesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Data Preferences
      </h2>

      <div className="mt-5 space-y-3">
        {dataOptions.map((option) => (
          <div key={option.title} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-950">
                  {option.title}
                </div>
                <div className="mt-1 text-sm text-slate-500">
                  {option.description}
                </div>
              </div>

              <span className="text-sm font-semibold text-slate-700">
                {option.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
