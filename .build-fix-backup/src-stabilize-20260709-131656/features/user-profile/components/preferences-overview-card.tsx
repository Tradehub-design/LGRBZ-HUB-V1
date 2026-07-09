const preferences = [
  "AUD base currency",
  "DD/MM/YYYY date format",
  "Email reports disabled",
  "Price alerts enabled",
];

export function PreferencesOverviewCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Preferences Overview
      </h2>

      <div className="mt-5 space-y-3">
        {preferences.map((item) => (
          <div key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}