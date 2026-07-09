const recommendations = [
  "Increase international ETF exposure.",
  "Reduce concentration in your largest holding.",
  "Maintain 10–15% cash reserve.",
  "Review allocation every quarter.",
];

export function ImprovementRecommendationsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Recommendations
      </h2>

      <div className="mt-5 space-y-3">
        {recommendations.map((item) => (
          <div
            key={item}
            className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-900"
          >
            ✓ {item}
          </div>
        ))}
      </div>
    </div>
  );
}
