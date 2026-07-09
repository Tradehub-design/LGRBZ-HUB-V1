const rules = [
  "Wrap all large tables in overflow-x-auto containers.",
  "Keep the first identifying column visible where possible.",
  "Use smaller text on mobile for dense financial tables.",
  "Move secondary columns into detail drawers on small screens.",
];

export function TableOptimisationCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Table Optimisation
      </h2>

      <div className="mt-5 space-y-3">
        {rules.map((rule) => (
          <div key={rule} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {rule}
          </div>
        ))}
      </div>
    </div>
  );
}