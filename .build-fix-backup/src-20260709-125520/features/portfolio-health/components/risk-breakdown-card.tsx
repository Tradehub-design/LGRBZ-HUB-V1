const risks = [
  {
    title: "Concentration Risk",
    level: "Medium",
    description: "Largest holding exceeds recommended allocation.",
  },
  {
    title: "Sector Risk",
    level: "Low",
    description: "Technology weighting remains within target.",
  },
  {
    title: "Currency Risk",
    level: "Low",
    description: "AUD/USD exposure is balanced.",
  },
  {
    title: "Liquidity Risk",
    level: "Very Low",
    description: "Portfolio consists of highly liquid securities.",
  },
];

export function RiskBreakdownCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Risk Breakdown
      </h2>

      <div className="mt-5 space-y-3">
        {risks.map((risk) => (
          <div key={risk.title} className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{risk.title}</span>

              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold">
                {risk.level}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {risk.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
