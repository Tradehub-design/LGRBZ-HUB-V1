const usage = [
  { label: "Portfolios", value: "3" },
  { label: "Holdings", value: "24" },
  { label: "Transactions", value: "318" },
  { label: "Reports Generated", value: "12" },
];

export function AccountUsageCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Account Usage
      </h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {usage.map((item) => (
          <div key={item.label} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-xs uppercase text-slate-500">{item.label}</div>
            <div className="mt-2 text-xl font-semibold text-slate-950">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}