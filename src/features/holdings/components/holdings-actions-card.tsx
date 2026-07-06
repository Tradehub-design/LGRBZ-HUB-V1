const actions = [
  {
    title: "Add new holding",
    description: "Record a new stock, ETF or cash position.",
  },
  {
    title: "Import broker file",
    description: "Upload transactions or holdings from broker CSV.",
  },
  {
    title: "Recalculate prices",
    description: "Refresh market value, P/L and portfolio weights.",
  },
];

export function HoldingsActionsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Holding Actions
      </h2>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100"
          >
            <div className="text-sm font-semibold text-slate-950">
              {action.title}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {action.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
