const insights = [
  {
    title: "Main return driver",
    body: "Most portfolio growth came from ETF exposure and the NDQ position.",
  },
  {
    title: "Main risk area",
    body: "Individual share exposure is above the current preferred target.",
  },
  {
    title: "Next review focus",
    body: "Review cash buffer and whether new contributions should go to VAS or cash.",
  },
];

export function PerformanceInsightsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Performance Insights
      </h2>

      <div className="mt-5 space-y-3">
        {insights.map((insight) => (
          <div key={insight.title} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-sm font-semibold text-slate-950">
              {insight.title}
            </div>
            <p className="mt-1 text-sm text-slate-500">{insight.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
