import { assetAllocation } from "../mock-data";

export function RebalanceRecommendationsCard() {
  const rows = assetAllocation.map((asset) => {
    const difference = asset.percentage - asset.targetPercentage;

    return {
      ...asset,
      difference,
      action:
        Math.abs(difference) <= 2
          ? "Hold"
          : difference > 0
            ? "Trim"
            : "Add",
    };
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Rebalancing Recommendations
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-semibold text-slate-950">
                {row.category}
              </div>
              <div className="text-xs text-slate-500">
                Current {row.percentage}% · Target {row.targetPercentage}%
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-slate-950">
                {row.action}
              </div>
              <div className="text-xs text-slate-500">
                {row.difference >= 0 ? "+" : ""}
                {row.difference.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
