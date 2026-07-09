export function SecurityScoreCard() {
  const score = 92;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-center">
        <div className="text-sm text-slate-500">
          Security Score
        </div>

        <div className="mt-3 text-6xl font-bold text-slate-950">
          {score}
        </div>

        <div className="mt-2 text-sm text-emerald-600 font-semibold">
          Excellent
        </div>

        <div className="mt-6 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-slate-950"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}