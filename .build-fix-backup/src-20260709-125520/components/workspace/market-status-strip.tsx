"use client";

const markets = [
  { label: "ASX", status: "Closed", change: "+0.42%" },
  { label: "NASDAQ", status: "Closed", change: "+1.12%" },
  { label: "S&P 500", status: "Closed", change: "+0.84%" },
  { label: "BTC", status: "Live", change: "-0.31%" },
  { label: "AUD/USD", status: "Live", change: "+0.08%" },
];

export function MarketStatusStrip() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {markets.map((market) => {
        const positive = market.change.startsWith("+");

        return (
          <div
            key={market.label}
            className="rounded-2xl border border-[#173047] bg-[#0b1e30] px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white">{market.label}</p>
              <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] text-slate-400">
                {market.status}
              </span>
            </div>
            <p className={positive ? "mt-2 text-sm text-emerald-300" : "mt-2 text-sm text-rose-300"}>
              {market.change}
            </p>
          </div>
        );
      })}
    </div>
  );
}
