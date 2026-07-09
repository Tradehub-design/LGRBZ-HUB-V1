const rules = [
  "Collapse sidebar navigation into a mobile menu.",
  "Keep Dashboard, Holdings and Reports one tap away.",
  "Use larger tap targets for mobile buttons.",
  "Avoid nested menus deeper than two levels.",
];

export function NavigationOptimisationCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Navigation Optimisation
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