const rows = [
  {
    source: "Brokerage Fees",
    impact: "-$128.40",
    note: "Trading cost drag",
  },
  {
    source: "FX Fees",
    impact: "-$42.18",
    note: "Currency conversion impact",
  },
];

export function NegativeContributorsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Negative Contributors
      </h2>

      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div key={row.source} className="rounded-xl bg-rose-50 px-4 py-3">
            <div className="flex justify-between">
              <span className="font-semibold text-rose-900">{row.source}</span>
              <span className="font-semibold text-rose-700">{row.impact}</span>
            </div>
            <div className="mt-1 text-xs text-rose-700">{row.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
