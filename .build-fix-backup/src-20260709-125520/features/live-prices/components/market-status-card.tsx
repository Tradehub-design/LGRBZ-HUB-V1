const markets = [
  {
    market: "ASX",
    status: "Open",
    closes: "16:00 AEST",
  },
  {
    market: "NASDAQ",
    status: "Open",
    closes: "16:00 EST",
  },
  {
    market: "NYSE",
    status: "Open",
    closes: "16:00 EST",
  },
];

export function MarketStatusCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Market Status
      </h2>

      <div className="mt-5 space-y-3">
        {markets.map((market) => (
          <div
            key={market.market}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <div>
              <div className="font-semibold">{market.market}</div>
              <div className="text-xs text-slate-500">
                Closes {market.closes}
              </div>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {market.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
