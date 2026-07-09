"use client";

const alerts = [
  {
    title: "Largest Position",
    description:
      "NDQ is above your preferred target allocation.",
    level: "Medium",
  },
  {
    title: "Cash Allocation",
    description:
      "Consider increasing cash before adding more single stocks.",
    level: "Low",
  },
  {
    title: "Diversification",
    description:
      "Healthcare allocation remains relatively small.",
    level: "Low",
  },
];

export function HoldingAlertsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Portfolio Alerts
      </h2>

      <div className="mt-5 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className="rounded-xl bg-slate-50 px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-950">
                {alert.title}
              </div>

              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                {alert.level}
              </span>
            </div>

            <div className="mt-1 text-sm text-slate-500">
              {alert.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
