const actions = [
  "Rebuild portfolio cache",
  "Recalculate performance",
  "Clean duplicate records",
  "Run database check",
];

export function AdminActionsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Admin Actions
      </h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action}
            type="button"
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-950 hover:bg-slate-100"
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
