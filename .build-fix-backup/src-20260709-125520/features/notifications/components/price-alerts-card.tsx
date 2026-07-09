const alerts = [
  {
    symbol: "NDQ",
    target: "$58.00",
    current: "$56.84",
  },
  {
    symbol: "VAS",
    target: "$108.00",
    current: "$106.42",
  },
  {
    symbol: "NAB",
    target: "$42.00",
    current: "$40.95",
  },
];

export function PriceAlertsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Active Price Alerts
      </h2>

      <div className="mt-5 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.symbol}
            className="rounded-xl bg-slate-50 px-4 py-3"
          >
            <div className="flex justify-between">
              <span className="font-semibold">
                {alert.symbol}
              </span>

              <span className="text-sm">
                {alert.current}
              </span>
            </div>

            <div className="mt-1 text-xs text-slate-500">
              Target Price: {alert.target}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}