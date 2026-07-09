"use client";

import { useSettingsStore } from "../store";

export function SettingsSummaryCard() {
  const {
    theme,
    baseCurrency,
    dateFormat,
    compactMode,
    enablePriceAlerts,
  } = useSettingsStore();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Current Settings
      </h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <Metric title="Theme" value={theme} />
        <Metric title="Currency" value={baseCurrency} />
        <Metric title="Date Format" value={dateFormat} />
        <Metric title="Compact Mode" value={compactMode ? "On" : "Off"} />
        <Metric title="Price Alerts" value={enablePriceAlerts ? "On" : "Off"} />
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}
