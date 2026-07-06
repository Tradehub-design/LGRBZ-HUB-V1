const upcoming = [
  {
    symbol: "VAS",
    date: "2026-09-25",
    expected: "$420",
  },
  {
    symbol: "NAB",
    date: "2026-11-18",
    expected: "$385",
  },
];

export function DividendCalendarCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Upcoming Dividends
      </h2>

      <div className="mt-5 space-y-3">
        {upcoming.map((row) => (
          <div
            key={row.symbol}
            className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <div>
              <div className="font-semibold">{row.symbol}</div>
              <div className="text-xs text-slate-500">
                {row.date}
              </div>
            </div>

            <div className="font-semibold">
              {row.expected}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
