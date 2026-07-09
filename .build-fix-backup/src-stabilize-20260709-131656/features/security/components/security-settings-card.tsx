const settings = [
  { label: "Two-factor authentication", value: "Recommended" },
  { label: "Session timeout", value: "30 minutes" },
  { label: "Export confirmation", value: "Enabled" },
  { label: "Broker access review", value: "Monthly" },
];

export function SecuritySettingsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Security Settings
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {settings.map((setting) => (
          <div key={setting.label} className="flex justify-between py-3">
            <span className="text-sm text-slate-600">{setting.label}</span>
            <span className="text-sm font-semibold text-slate-950">
              {setting.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}