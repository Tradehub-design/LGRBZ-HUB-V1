"use client";

import { useSettingsStore } from "../store";

export function AlertPreferencesCard() {
  const { enablePriceAlerts, togglePriceAlerts } = useSettingsStore();

  const alerts = [
    "Watchlist target reached",
    "Portfolio drops more than 5%",
    "Dividend payment received",
    "Tax year report ready",
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Alert Preferences
      </h2>

      <div className="mt-5 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="text-sm font-medium text-slate-700">
              {alert}
            </span>

            <button
              type="button"
              onClick={togglePriceAlerts}
              className={[
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                enablePriceAlerts
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-200 text-slate-700",
              ].join(" ")}
            >
              {enablePriceAlerts ? "Enabled" : "Disabled"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
