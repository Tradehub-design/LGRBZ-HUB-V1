const alerts = [
  {
    title: "AAPL above target",
    body: "Current price is above the preferred entry target.",
  },
  {
    title: "MSFT overvalued",
    body: "Watch for a pullback before adding to watchlist buy zone.",
  },
  {
    title: "NDQ already owned",
    body: "Consider current portfolio allocation before adding more.",
  },
];

export function WatchlistAlertsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Watchlist Alerts
      </h2>

      <div className="mt-5 space-y-3">
        {alerts.map((alert) => (
          <div key={alert.title} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-sm font-semibold text-slate-950">
              {alert.title}
            </div>
            <p className="mt-1 text-sm text-slate-500">{alert.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
