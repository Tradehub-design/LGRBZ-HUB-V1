const actions = [
  {
    title: "Review cash allocation",
    detail: "Cash is below the preferred buffer target.",
    priority: "High",
  },
  {
    title: "Check individual share exposure",
    detail: "Single stock allocation is above target.",
    priority: "Medium",
  },
  {
    title: "Prepare next contribution",
    detail: "Next monthly contribution can be allocated to VAS or cash.",
    priority: "Low",
  },
];

export function PortfolioActionsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Suggested Actions
      </h2>

      <div className="mt-5 space-y-3">
        {actions.map((action) => (
          <div key={action.title} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-semibold text-slate-950">
                {action.title}
              </div>

              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                {action.priority}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">{action.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
