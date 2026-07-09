const activities = [
  {
    action: "Imported CommSec transactions",
    time: "10 minutes ago",
  },
  {
    action: "Generated Portfolio Report",
    time: "1 hour ago",
  },
  {
    action: "Updated Dividend Forecast",
    time: "Yesterday",
  },
];

export function RecentActivityCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Recent Activity
      </h2>

      <div className="mt-5 space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.action}
            className="rounded-xl bg-slate-50 px-4 py-3"
          >
            <div className="font-semibold">
              {activity.action}
            </div>

            <div className="text-xs text-slate-500 mt-1">
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
