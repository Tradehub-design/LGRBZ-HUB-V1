"use client";

import { useSettingsStore } from "../store";
import type {
  CurrencyPreference,
  DateFormatPreference,
  ThemeMode,
} from "../types";

export function PreferenceSelectCard() {
  const {
    theme,
    baseCurrency,
    dateFormat,
    setTheme,
    setBaseCurrency,
    setDateFormat,
  } = useSettingsStore();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Display Preferences
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <SelectBox
          label="Theme"
          value={theme}
          options={["Light", "Dark", "System"]}
          onChange={(value) => setTheme(value as ThemeMode)}
        />

        <SelectBox
          label="Base Currency"
          value={baseCurrency}
          options={["AUD", "USD", "CNY"]}
          onChange={(value) => setBaseCurrency(value as CurrencyPreference)}
        />

        <SelectBox
          label="Date Format"
          value={dateFormat}
          options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
          onChange={(value) => setDateFormat(value as DateFormatPreference)}
        />
      </div>
    </div>
  );
}

function SelectBox({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <div className="text-sm font-medium text-slate-600">{label}</div>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400"
      >
        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </label>
  );
}
