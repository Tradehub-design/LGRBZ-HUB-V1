const watchlist = [
  "AAPL",
  "MSFT",
  "NDQ",
  "VAS",
  "GOOGL",
  "NVDA",
];

export function WatchlistLiveCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Favourite Symbols
      </h2>

      <div className="mt-5 flex flex-wrap gap-2">
        {watchlist.map((symbol) => (
          <div
            key={symbol}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold"
          >
            {symbol}
          </div>
        ))}
      </div>
    </div>
  );
}
