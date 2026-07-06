const insights = [
  "NDQ is the strongest return contributor this period.",
  "Dividend income adds stable non-price return.",
  "Financials are contributing positively but with concentration risk.",
];

export function AttributionInsightsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Attribution Insights
      </h2>

      <div className="mt-5 space-y-3">
        {insights.map((insight) => (
          <div key={insight} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {insight}
          </div>
        ))}
      </div>
    </div>
  );
}
