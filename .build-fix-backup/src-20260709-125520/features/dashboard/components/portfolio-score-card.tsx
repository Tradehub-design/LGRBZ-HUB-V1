const scores = [
  {
    label: "Diversification",
    score: 82,
  },
  {
    label: "Risk Control",
    score: 74,
  },
  {
    label: "Contribution Consistency",
    score: 91,
  },
  {
    label: "Cash Buffer",
    score: 68,
  },
];

export function PortfolioScoreCard() {
  const totalScore = Math.round(
    scores.reduce((sum, item) => sum + item.score, 0) / scores.length
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Portfolio Score
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Internal portfolio quality rating
          </p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-semibold text-slate-950">
            {totalScore}
          </div>
          <div className="text-xs text-slate-500">/ 100</div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {scores.map((item) => (
          <div key={item.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{item.label}</span>
              <span className="font-semibold text-slate-950">
                {item.score}
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-950"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
