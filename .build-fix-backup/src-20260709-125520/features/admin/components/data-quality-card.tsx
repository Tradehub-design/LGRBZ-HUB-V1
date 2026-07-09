const checks = [
  {
    label: "Duplicate Transactions",
    status: "Passed",
    detail: "No duplicate transaction IDs detected.",
  },
  {
    label: "Missing Prices",
    status: "Review",
    detail: "Two holdings require updated market prices.",
  },
  {
    label: "Tax Mapping",
    status: "Review",
    detail: "One tax event requires manual review.",
  },
];

export function DataQualityCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Data Quality
      </h2>

      <div className="mt-5 space-y-3">
        {checks.map((check) => (
          <div key={check.label} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-slate-950">
                {check.label}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {check.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{check.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
