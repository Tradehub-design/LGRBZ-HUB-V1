const history = [
  {
    date: "07 Jul 2026",
    count: 6,
  },
  {
    date: "06 Jul 2026",
    count: 3,
  },
  {
    date: "05 Jul 2026",
    count: 4,
  },
];

export function NotificationHistoryCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Notification History
      </h2>

      <div className="mt-5 space-y-3">
        {history.map((day) => (
          <div
            key={day.date}
            className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span>{day.date}</span>

            <span className="font-semibold">
              {day.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}