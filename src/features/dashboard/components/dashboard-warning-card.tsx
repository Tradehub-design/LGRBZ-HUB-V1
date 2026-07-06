const warnings = [
  "Individual share exposure is above the current target.",
  "Cash buffer is below the preferred target.",
  "Portfolio is heavily weighted to AUD assets.",
];

export function DashboardWarningCard() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-amber-950">
        Dashboard Warnings
      </h2>

      <div className="mt-4 space-y-2">
        {warnings.map((warning) => (
          <div key={warning} className="text-sm font-medium text-amber-800">
            {warning}
          </div>
        ))}
      </div>
    </div>
  );
}
