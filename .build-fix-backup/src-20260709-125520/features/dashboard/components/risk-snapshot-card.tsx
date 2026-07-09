const riskItems = [
  {
    label: "Largest Holding",
    value: "NDQ",
    detail: "15.66% of portfolio",
  },
  {
    label: "Cash Weight",
    value: "6.67%",
    detail: "Available buying power",
  },
  {
    label: "Single Stock Exposure",
    value: "31.51%",
    detail: "Across NAB, COH, LIFE360",
  },
  {
    label: "ETF Exposure",
    value: "61.82%",
    detail: "Diversified holdings",
  },
];

export function RiskSnapshotCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Risk Snapshot</h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {riskItems.map((item) => (
          <div key={item.label} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {item.label}
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-950">
              {item.value}
            </div>
            <div className="mt-1 text-xs text-slate-500">{item.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
