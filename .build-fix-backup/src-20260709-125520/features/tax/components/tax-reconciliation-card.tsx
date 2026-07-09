const rows = [
  { source: "CommSec", status: "Matched", difference: "$0.00" },
  { source: "CommSec Pocket", status: "Matched", difference: "$0.00" },
  { source: "Manual Events", status: "Review", difference: "$19.90" },
];

export function TaxReconciliationCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Tax Reconciliation
      </h2>

      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div key={row.source} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex justify-between">
              <span className="text-sm font-semibold text-slate-950">
                {row.source}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {row.status}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Difference: {row.difference}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
