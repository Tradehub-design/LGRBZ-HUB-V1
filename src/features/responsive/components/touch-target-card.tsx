const checks = [
  { label: "Buttons", status: "Minimum 44px height" },
  { label: "Inputs", status: "Mobile friendly" },
  { label: "Dropdowns", status: "Full-width on mobile" },
  { label: "Cards", status: "Stacked layout" },
];

export function TouchTargetCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Touch Targets
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {checks.map((check) => (
          <div key={check.label} className="flex justify-between py-3">
            <span className="text-sm text-slate-600">{check.label}</span>
            <span className="text-sm font-semibold text-slate-950">
              {check.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}