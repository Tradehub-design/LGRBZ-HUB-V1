const alerts = [
  {
    symbol: "NDQ",
    trigger: "Below $45.00",
  },
  {
    symbol: "VAS",
    trigger: "Above $100.00",
  },
  {
    symbol: "AAPL",
    trigger: "Below US$200",
  },
];

export function PriceAlertsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Price Alerts
      </h2>

      <div className="mt-5 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.symbol}
            className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="font-semibold">
              {alert.symbol}
            </span>

            <span className="text-slate-600">
              {alert.trigger}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
