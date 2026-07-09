const audit = [
  "TX001 created from CommSec import",
  "TX002 created manually",
  "TX003 marked as dividend income",
];

export function AuditTrailCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Audit Trail</h2>

      <div className="mt-5 space-y-3">
        {audit.map((item) => (
          <div key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
