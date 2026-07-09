const checks = [
  {
    label: "Diversification",
    status: "Healthy",
    detail: "ETF exposure remains the largest portfolio component.",
  },
  {
    label: "Cash Buffer",
    status: "Watch",
    detail: "Cash remains below the preferred $30,000 target.",
  },
  {
    label: "Single Stock Risk",
    status: "Watch",
    detail: "Individual shares are above the current target allocation.",
  },
  {
    label: "Contribution Plan",
    status: "Healthy",
    detail: "Regular monthly investment plan is active.",
  },
];

export function PortfolioHealthCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Portfolio Health
      </h2>

      <div className="mt-5 space-y-3">
        {checks.map((check) => {
          const healthy = check.status === "Healthy";

          return (
            <div key={check.label} className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm font-semibold text-slate-950">
                  {check.label}
                </div>

                <span
                  className={[
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    healthy
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700",
                  ].join(" ")}
                >
                  {check.status}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">{check.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
