const rules = [
  "Keep long-term ETF contributions consistent.",
  "Avoid adding to single stocks if individual share exposure is above target.",
  "Keep cash buffer close to $30,000 before increasing higher-risk positions.",
  "Review portfolio allocation monthly, not daily.",
];

export function InvestmentRulesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Investment Rules
      </h2>

      <div className="mt-5 space-y-3">
        {rules.map((rule, index) => (
          <div
            key={rule}
            className="flex gap-3 rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
              {index + 1}
            </span>
            <p className="text-sm text-slate-600">{rule}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
