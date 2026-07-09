"use client";

import { useSettingsStore } from "../store";

export function SettingsToggleCard() {
  const {
    compactMode,
    showDividends,
    showTaxEstimates,
    enablePriceAlerts,
    enableEmailReports,
    toggleCompactMode,
    toggleShowDividends,
    toggleShowTaxEstimates,
    togglePriceAlerts,
    toggleEmailReports,
  } = useSettingsStore();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Feature Preferences
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        <ToggleRow
          label="Compact Mode"
          description="Reduce spacing across tables and cards."
          checked={compactMode}
          onChange={toggleCompactMode}
        />

        <ToggleRow
          label="Show Dividends"
          description="Include dividend cards and income summaries."
          checked={showDividends}
          onChange={toggleShowDividends}
        />

        <ToggleRow
          label="Show Tax Estimates"
          description="Display estimated tax and capital gains sections."
          checked={showTaxEstimates}
          onChange={toggleShowTaxEstimates}
        />

        <ToggleRow
          label="Price Alerts"
          description="Enable alerts for watchlist target prices."
          checked={enablePriceAlerts}
          onChange={togglePriceAlerts}
        />

        <ToggleRow
          label="Email Reports"
          description="Send regular portfolio performance summaries."
          checked={enableEmailReports}
          onChange={toggleEmailReports}
        />
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div>
        <div className="text-sm font-semibold text-slate-950">{label}</div>
        <div className="mt-1 text-sm text-slate-500">{description}</div>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={[
          "relative h-6 w-11 rounded-full transition",
          checked ? "bg-slate-950" : "bg-slate-200",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white transition",
            checked ? "left-6" : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
