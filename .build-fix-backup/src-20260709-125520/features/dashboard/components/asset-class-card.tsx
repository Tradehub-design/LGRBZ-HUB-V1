import { formatMoney } from "../format";

const assetClasses = [
  {
    label: "ETFs",
    value: 79400,
    percentage: 61.82,
  },
  {
    label: "Individual Shares",
    value: 40470,
    percentage: 31.51,
  },
  {
    label: "Cash",
    value: 8550.72,
    percentage: 6.67,
  },
];

export function AssetClassCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Asset Classes
      </h2>

      <div className="mt-5 space-y-4">
        {assetClasses.map((asset) => (
          <div key={asset.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{asset.label}</span>
              <span className="text-slate-500">
                {asset.percentage.toFixed(2)}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-950"
                style={{ width: `${asset.percentage}%` }}
              />
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {formatMoney(asset.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
