const recent = [
  "NDQ",
  "Dividend Forecast",
  "Portfolio Health",
  "Tax Summary",
  "NAB",
];

export function RecentSearchesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Recent Searches
      </h2>

      <div className="mt-5 flex flex-wrap gap-2">
        {recent.map((item) => (
          <div
            key={item}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
