const events = [
  {
    id: "1",
    title: "VAS Dividend Payment",
    date: "2026-07-18",
    type: "Dividend",
  },
  {
    id: "2",
    title: "NAB Ex-Dividend Date",
    date: "2026-08-07",
    type: "Dividend",
  },
  {
    id: "3",
    title: "Monthly ETF Auto-Invest",
    date: "2026-08-15",
    type: "Contribution",
  },
  {
    id: "4",
    title: "Portfolio Review",
    date: "2026-09-01",
    type: "Review",
  },
];

export function UpcomingEventsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Upcoming Events
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
          >
            <div>
              <div className="text-sm font-semibold text-slate-950">
                {event.title}
              </div>
              <div className="text-xs text-slate-500">{event.type}</div>
            </div>

            <div className="text-right text-xs font-medium text-slate-500">
              {new Date(event.date).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
