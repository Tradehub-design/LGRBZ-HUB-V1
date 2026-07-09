"use client";

import { useSettingsStore } from "../store";

export function SettingsFooterSummary() {
  const {
    theme,
    baseCurrency,
    dateFormat,
    enablePriceAlerts,
  } = useSettingsStore();

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Theme" value={theme} />
        <Metric title="Currency" value={baseCurrency} />
        <Metric title="Date Format" value={dateFormat} />
        <Metric title="Alerts" value={enablePriceAlerts ? "On" : "Off"} />
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
