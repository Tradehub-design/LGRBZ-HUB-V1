const preferences = [
  {
    title: "Price Alerts",
    enabled: true,
  },
  {
    title: "Dividend Notifications",
    enabled: true,
  },
  {
    title: "Report Notifications",
    enabled: true,
  },
  {
    title: "System Notifications",
    enabled: false,
  },
];

export function NotificationPreferencesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Notification Preferences
      </h2>

      <div className="mt-5 space-y-3">
        {preferences.map((item) => (
          <div
            key={item.title}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="font-medium text-slate-700">
              {item.title}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                item.enabled
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {item.enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}