const settings = [
  { label: "Default Currency", value: "AUD" },
  { label: "Performance Method", value: "Money-weighted" },
  { label: "Cash Included", value: "Yes" },
  { label: "Auto Recalculate", value: "Enabled" },
];

export function AccountSettingsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Account Settings</h2>

      <div className="mt-5 divide-y divide-slate-100">
        {settings.map((setting) => (
          <div key={setting.label} className="flex justify-between py-3">
            <span className="text-sm font-medium text-slate-600">{setting.label}</span>
            <span className="text-sm font-semibold text-slate-950">{setting.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
