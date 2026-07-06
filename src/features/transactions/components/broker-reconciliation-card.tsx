const rows = [
  { broker: "CommSec", imported: 128, matched: 126, unmatched: 2 },
  { broker: "CommSec Pocket", imported: 44, matched: 44, unmatched: 0 },
];

export function BrokerReconciliationCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Broker Reconciliation</h2>

      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div key={row.broker} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="font-semibold text-slate-950">{row.broker}</div>
            <div className="mt-1 text-sm text-slate-500">
              {row.matched}/{row.imported} matched · {row.unmatched} unmatched
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
